import templateUrl from './details.html';

/** @ngInject */
export function RequestsDetailsState(routerHelper, RBAC) {
  routerHelper.configureStates(getStates(RBAC));
}

function getStates(RBAC) {
  return {
    'requests.details': {
      url: '/:requestId',
      templateUrl,
      controller: RequestDetailsController,
      controllerAs: 'vm',
      title: __('Request Details'),
      resolve: {
        request: resolveRequest,
      },
      data: {
        authorization: RBAC.hasAny(['miq_request','miq_request_admin','miq_request_show']),
      },
    },
  };
}

/** @ngInject */
function resolveRequest($stateParams, CollectionsApi) {
  var options = {attributes: ['provision_dialog', 'picture', 'picture.image_href']};

  return CollectionsApi.get('requests', $stateParams.requestId, options);
}

/** @ngInject */
function RequestDetailsController(request, CollectionsApi, DialogFieldRefresh, EventNotifications, $state, RBAC) {
  var vm = this;
  var autoRefreshableDialogFields = [];
  var allDialogFields = [];

  vm.editingDisabled = true;
  vm.editPermission = RBAC.has('miq_request_edit');
  vm.title = request.description;
  vm.request = request;
  vm.dialogs = [];

  if (angular.isDefined(request.provision_dialog)) {
    vm.dialogs.push(request.provision_dialog);
    DialogFieldRefresh.setupDialogData(vm.dialogs, allDialogFields, autoRefreshableDialogFields);

    var dialogUrl = 'service_catalogs/' + vm.request.source_id + '/service_templates';

    angular.forEach(allDialogFields, function (dialogField) {
      dialogField.refreshSingleDialogField = function () {
        DialogFieldRefresh.refreshSingleDialogField(allDialogFields, dialogField, dialogUrl, vm.request.source_id);
      };
    });
  }

  function saveRequest() {
    var dialogData = dataForSubmit();

    CollectionsApi.post(
      'service_requests',
      request.id,
      {},
      { action: 'edit', options: { "dialog": dialogData } }
    ).then(submitSuccess, submitFailure);
  }

  function cancelRequest() {
    $state.reload();
  }
  function dataForSubmit() {
    var dialogFieldData = {};

    angular.forEach(allDialogFields, function(dialogField) {
      if ((dialogField.type === "DialogFieldTagControl" || dialogField.type === "DialogFieldDropDownList")
          && dialogField.default_value instanceof Array) {
        dialogFieldData['dialog_' + dialogField.name] = dialogField.default_value.join();
      } else {
        dialogFieldData['dialog_' + dialogField.name] = dialogField.default_value;
      }
    });

    return dialogFieldData;
  }
  vm.saveRequest = saveRequest;
  vm.cancelRequest = cancelRequest;
  function submitSuccess(result) {
    EventNotifications.success(result.message);
  }

  function submitFailure(result) {
    EventNotifications.error(__('There was an error submitting this request: ') + result);
  }
}
