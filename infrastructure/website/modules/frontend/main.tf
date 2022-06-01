resource "random_string" "resource_code" {
  length  = 15
  special = false
  upper   = false
}

resource "azurerm_storage_account" "this" {
  name                = "${random_string.resource_code.result}storage"
  resource_group_name = var.resource_group

  location                 = var.location
  account_kind             = "StorageV2"
  account_tier             = "Premium"
  access_tier              = "Hot"
  account_replication_type = "LRS"
  static_website {
    index_document     = "index.html"
    error_404_document = "404.html"
  }
}

resource "azurerm_storage_container" "web" {
  name                  = "$web"
  storage_account_name  = azurerm_storage_account.this.name
  container_access_type = "blob"
}
