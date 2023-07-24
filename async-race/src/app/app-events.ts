enum AppEvents {
  SwitchView = 'switch-view',
  CarCreate = 'car-create',
  CarCreated = 'car-created',
  CarUpdate = 'car-update',
  CarUpdated = 'car-updated',
  CarDelete = 'car-delete',
  CarDeleted = 'car-deleted',
  CarsPageLoad = 'cars-page-load',
  GenerateCars = 'generate-cars',
  CarsGenerated = 'cars-generated',
  CarToggleEngine = 'car-toggle-engine',
  CarEngineToggled = 'car-engine-toggled',
  RequestCarDrive = 'request-car-drive',
  ResponseCarDrive = 'response-car-drive',
  CarFinished = 'car-finished',
}

export default AppEvents;
