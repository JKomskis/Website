locals {
  resource_group = terraform.workspace == "prod" ? "website" : "website-${terraform.workspace}"
}

resource "azurerm_resource_group" "this" {
  name     = local.resource_group
  location = var.location
}

module "frontend" {
  source         = "./modules/frontend"
  resource_group = azurerm_resource_group.this.name
  location       = var.location
}
