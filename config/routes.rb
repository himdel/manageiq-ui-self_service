# ManageIQ::UI::Service::Engine.routes.draw do
Rails.application.routes.draw do
  get '/ui/service' => 'ui_service#index'
end
