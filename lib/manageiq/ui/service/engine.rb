module ManageIQ::UI::Service
  class Engine < ::Rails::Engine
    isolate_namespace ManageIQ::UI::Service

    def self.vmdb_plugin?
      true
    end

    initializer 'plugin.assets' do |app|
      app.config.assets.paths << root.join('assets', 'images').to_s
    end

    initializer 'plugin-migration-menu' do
      Menu::CustomLoader.register(
        Menu::Section.new(:ui_service, N_("Service UI"), 'pficon pficon-migration', [
          Menu::Item.new('plans', N_("TODO"), 'migration', {:feature => 'migration', :any => true}, '/ui/service'),
        ])
      )
    end

    def self.plugin_name
      _('Service UI')
    end
  end
end
