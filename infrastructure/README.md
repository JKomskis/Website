The infrastructure of the website is split into multiple parts:

* `tfstate` - creates a storage account that holds the remote Terraform state for the other modules. This only needs to be manually deployed once.
* `dns` - creates DNS records on Cloudflare to point to the resources created in `website`. This should be deployed by the CI/CD pipeline. This is separate from `website` because Azure requires the DNS records to be created before and deleted before the Azure CDN custom domain is created/deleted. It's not possible to easily do both with the Terraform dependency graph.
* `website` - creates the Azure resources needed for the website, e.g. the storage account. This should be deploymed by the CI/CD pipeline.
* `cdn-dns` - creates DNS records on Cloudflare to point to the resources creates in `cdn`. This only needs to be manually deployed once.
* `cdn` - creates the Azure resources for the CDN portion of the website, which is shared by all deployments. This only needs to be manually deployed once.
* `analytics` - TODO; creates the necessary resources for the analytis of the website. This only needs to be manually deployed once.


Each environment in `dns` and `website` is deployed through Terraform workspaces, so the infrastructure of one environment doesn't affect another.
To deploy to production, the `prod` workspace should be used.
The other parts of the infrastructure should use the default workspace.