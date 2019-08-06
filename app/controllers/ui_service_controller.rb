class UIServiceController < ApplicationController
  before_action :check_privileges
  after_action :cleanup_action

  def index
    @layout = 'ui_service'
    @page_title = _('Service UI')
  end

  helper do
    def layout_full_center
      "layouts/center_div_no_listnav"
    end
  end
end
