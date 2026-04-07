// swift-tools-version: 5.9
import PackageDescription

let package = Package(
    name: "CapacitorPluginCdvPurchase",
    platforms: [.iOS(.v15)],
    products: [
        .library(
            name: "CapacitorPluginCdvPurchase",
            targets: ["PurchasePlugin"])
    ],
    dependencies: [
        .package(url: "https://github.com/ionic-team/capacitor-swift-pm.git", "6.0.0"..<"10.0.0")
    ],
    targets: [
        .target(
            name: "PurchasePlugin",
            dependencies: [
                .product(name: "Capacitor", package: "capacitor-swift-pm"),
                .product(name: "Cordova", package: "capacitor-swift-pm")
            ],
            path: "ios/Sources/PurchasePlugin",
            swiftSettings: [
                .enableExperimentalFeature("NonescapableTypes")
            ])
    ]
)
