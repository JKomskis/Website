locals {
  resource_group         = "cdn"
  storage_container_name = "cdn"
  domain                 = "jkomskis.com"
  cdn_record_name        = "cdn2"
}

resource "azurerm_resource_group" "this" {
  name     = local.resource_group
  location = var.location
}

resource "random_string" "resource_code" {
  length  = 15
  special = false
  upper   = false
  keepers = {
    resource_group = local.resource_group
  }
}

resource "azurerm_storage_account" "this" {
  name                = "${random_string.resource_code.result}storage"
  resource_group_name = local.resource_group

  location                 = var.location
  account_kind             = "StorageV2"
  account_tier             = "Premium"
  access_tier              = "Hot"
  account_replication_type = "LRS"
}

resource "azurerm_storage_container" "this" {
  name                  = local.storage_container_name
  storage_account_name  = azurerm_storage_account.this.name
  container_access_type = "blob"
}

resource "azurerm_cdn_profile" "this" {
  name                = "cdn"
  location            = var.location
  resource_group_name = local.resource_group
  sku                 = "Standard_Microsoft"
}

resource "azurerm_cdn_endpoint" "this" {
  name                = "${local.cdn_record_name}-jkomskis"
  profile_name        = azurerm_cdn_profile.this.name
  location            = var.location
  resource_group_name = local.resource_group
  origin_host_header  = azurerm_storage_account.this.primary_blob_host

  origin {
    name      = "static-website"
    host_name = azurerm_storage_account.this.primary_blob_host
  }
}

resource "azurerm_cdn_endpoint_custom_domain" "this" {
  name            = "jkomskis-domain"
  cdn_endpoint_id = azurerm_cdn_endpoint.this.id
  host_name       = "${local.cdn_record_name}.${local.domain}"
  cdn_managed_https {
    certificate_type = "Dedicated"
    protocol_type    = "ServerNameIndication"
  }
}
