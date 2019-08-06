$:.push File.expand_path("../lib", __FILE__)

# Maintain your gem's version:
require "manageiq/ui/service/version"

# Describe your gem and declare its dependencies:
Gem::Specification.new do |s|
  s.name        = "manageiq-ui-service"
  s.version     = ManageIQ::UI::Service::VERSION
  s.authors     = ['ManageIQ Authors']
  s.homepage    = 'http://www.manageiq.org'
  s.summary     = "ManageIQ Service UI"
  s.description = "ManageIQ Service UI"
  s.license     = "Apache-2.0"

  s.files = Dir["{app,client,lib}/**/*", "LICENSE.txt", "Rakefile", "README.md"]
end
