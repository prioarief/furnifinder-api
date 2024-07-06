# Makefile

# Default goal
.DEFAULT_GOAL := help

# Feature variable
FEATURE ?= example

# Directory variable
DIR ?= src

# Ensure the directory exists
$(DIR):
	@mkdir -p $(DIR)

# File generation
generate: $(DIR)
	@touch $(DIR)/$(FEATURE).route.js
	@touch $(DIR)/$(FEATURE).controller.js
	@touch $(DIR)/$(FEATURE).model.js
	@touch $(DIR)/$(FEATURE).validation.js
	@echo "Files $(DIR)/$(FEATURE).route.js and $(DIR)/$(FEATURE).controller.js created successfully!"

# make generate FEATURE=category DIR=modules/v1/category 
