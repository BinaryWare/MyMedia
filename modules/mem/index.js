/**
 * @module Mem
 */

var mem_db = null;

exports.setMemDB = function(db){ mem_db = db; };

exports.getMemDB = function(){ return mem_db; };
