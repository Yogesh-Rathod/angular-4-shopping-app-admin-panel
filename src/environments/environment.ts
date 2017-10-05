// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
  production: false,
  apiUrl: 'http://192.168.250.224:8080',
  crmUrl: 'http://192.168.250.222:9081/crm',
  loginUrl: 'http://localhost:4300/',
  usersUrl: 'http://192.168.250.222:8088',
  customersAPIUrl: 'http://192.168.250.232:8310',
  rbacUrl: 'http://192.168.250.222:8088/security',
  masterApiUrl: '',
  storeApiUrl: '',
  appName: 'CRM',
  domainName: 'localhost',
  timeOut: 30000,
  crm: {
    itemsPerPage: 10,
  }
};
