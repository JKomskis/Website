locals {
  resource_group = var.deployment_prefix == "" ? "website" : "website-${var.deployment_prefix}"
}

resource "azurerm_resource_group" "this" {
  name     = local.resource_group
  location = var.location
}

module "frontend" {
  source            = "./modules/frontend"
  deployment_prefix = var.deployment_prefix
  resource_group    = azurerm_resource_group.this.name
  location          = var.location
}
