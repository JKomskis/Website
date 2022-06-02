locals {
  zone_id = "63e0c4e8461fe6f7acd680c3a2c8ba9d"
  domain  = "jkomskis.com"
}

resource "random_string" "resource_code" {
  length  = 15
  special = false
  upper   = false
  keepers = {
    resource_group = var.resource_group
  }
}

resource "azurerm_storage_account" "this" {
  name                = "${random_string.resource_code.result}storage"
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

resource "cloudflare_record" "www" {
  zone_id = local.zone_id
  name    = "www${terraform.workspace == "prod" ? "" : ".${terraform.workspace}"}"
  value   = azurerm_storage_account.this.primary_web_host
  type    = "CNAME"
  proxied = true
}
