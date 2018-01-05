#!/bin/bash

ls ../list/ | awk '\
    BEGIN   { ORS=""; \
              print "[\"" } \
            { if(length($0) > 0) { print "list/" $0 "\",\"" } } \
    END     { print "\"]" } \
' > main.list