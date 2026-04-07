require 'json'

package = JSON.parse(File.read(File.join(__dir__, 'package.json')))

Pod::Spec.new do |s|
  s.name         = 'CapacitorPluginCdvPurchase'
  s.version      = package['version']
  s.summary      = package['description']
  s.license      = package['license']
  s.homepage     = package['repository']['url']
  s.author       = 'Jean-Christophe Hoelt'
  s.source       = { :git => package['repository']['url'], :tag => s.version.to_s }
  s.source_files = 'ios/Sources/PurchasePlugin/**/*.{swift,h,m}'
  s.ios.deployment_target = '13.0'
  s.swift_version = '5.9'
  s.dependency 'Capacitor'
  s.frameworks   = 'StoreKit'
end
