module.exports = function() {
    let deploymentName = process.env.DEPLOYMENT_NAME || "";
    let apiBasePath = `https://jkomskis${deploymentName == "prod" ? "" : "-"+deploymentName}.azurewebsite.net`

    return apiBasePath;
}