terraform {
  required_providers {
    azurerm = {
      source  = "hashicorp/azurerm",
      version = "~> 3.8.0"
    }
    random = {
      source  = "hashicorp/random",
      version = "~> 3.3.1"
    }
  }
  backend "azurerm" {
    resource_group_name  = "tfstate"
    storage_account_name = "tfstatey2211t1ee3l4g9e"
    container_name       = "tfstate"
    key                  = "website.tfstate"
  }
}

provider "azurerm" {
  features {}
  skip_provider_registration = "true"
}
