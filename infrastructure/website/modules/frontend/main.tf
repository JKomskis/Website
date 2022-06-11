locals {
  domain          = "jkomskis.com"
  www_record_name = "www${terraform.workspace == "prod" ? "" : "-${terraform.workspace}"}"
}

resource "azurerm_storage_account" "this" {
  name                = "${var.resource_code}storage"
  resource_group_name = var.resource_group

  location                 = var.location
  account_kind             = "StorageV2"
  account_tier             = "Standard"
  access_tier              = "Hot"
  account_replication_type = "LRS"
  static_website {
    index_document = "index.html"
  }
}

resource "azurerm_cdn_profile" "this" {
  name                = "website-cdn"
  location            = var.location
  resource_group_name = var.resource_group
  sku                 = "Standard_Microsoft"
}

resource "azurerm_cdn_endpoint" "www" {
  name                = "${local.www_record_name}-jkomskis"
  profile_name        = azurerm_cdn_profile.this.name
  location            = var.location
  resource_group_name = var.resource_group
  origin_host_header  = azurerm_storage_account.this.primary_web_host

  origin {
    name      = "static-website"
    host_name = azurerm_storage_account.this.primary_web_host
  }
}

resource "azurerm_cdn_endpoint_custom_domain" "www" {
  name            = "jkomskis-domain"
  cdn_endpoint_id = azurerm_cdn_endpoint.www.id
  host_name       = "${local.www_record_name}.${local.domain}"
  cdn_managed_https {
    certificate_type = "Dedicated"
    protocol_type    = "ServerNameIndication"
  }
}
