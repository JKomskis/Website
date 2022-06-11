locals {
  resource_group = terraform.workspace == "prod" ? "website" : "website-${terraform.workspace}"
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

module "frontend" {
  source         = "./modules/frontend"
  resource_group = azurerm_resource_group.this.name
  resource_code  = random_string.resource_code.result
  location       = var.location
}

module "backend" {
  source                            = "./modules/backend"
  resource_group                    = azurerm_resource_group.this.name
  resource_code                     = random_string.resource_code.result
  location                          = var.location
  storage_account_name              = module.frontend.storage_account_name
  storage_account_connection_string = module.frontend.storage_account_connection_string
}
