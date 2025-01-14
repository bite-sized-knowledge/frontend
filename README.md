#!/bin/bash

# Install nvm (Node Version Manager) and Node.js 18.20.4

brew install nvm
brew install watchman
nvm install 18.20.4

# Clean npm cache and reinstall node modules

npm cache clean --force
rm -rf node_modules
npm install

# Switch to the correct version of Xcode

sudo xcode-select --switch /Applications/Xcode.app/Contents/Developer

# Navigate to the iOS directory

cd ios

# Install specific version of the drb gem (2.0.6)

sudo gem install drb -v 2.0.6

# Install and set up rbenv for Ruby version management

brew install rbenv
rbenv init
rbenv install 3.2.2
rbenv global 3.2.2

# Install CocoaPods

sudo gem install cocoapods

# Clean up existing Pods and reinstall them

rm -rf Pods Podfile.lock
pod install
