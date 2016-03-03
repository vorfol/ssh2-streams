var utils = require('../lib/utils');

var fs = require('fs');
var path = require('path');
var assert = require('assert');

var t = -1;
var group = path.basename(__filename, '.js') + '/';
var fixturesdir = path.join(__dirname, 'fixtures');

var tests = [
  { run: function() {
      var what = this.what;
      var r;

      assert.strictEqual(r = utils.readInt(new Buffer([0,0,0]), 0),
                         false,
                         makeMsg(what, 'Wrong result: ' + r));
      next();
    },
    what: 'readInt - without stream callback - failure #1'
  },
  { run: function() {
      var what = this.what;
      var r;

      assert.strictEqual(r = utils.readInt(new Buffer([]), 0),
                         false,
                         makeMsg(what, 'Wrong result: ' + r));
      next();
    },
    what: 'readInt - without stream callback - failure #2'
  },
  { run: function() {
      var what = this.what;
      var r;

      assert.strictEqual(r = utils.readInt(new Buffer([0,0,0,5]), 0),
                         5,
                         makeMsg(what, 'Wrong result: ' + r));
      next();
    },
    what: 'readInt - without stream callback - success'
  },
  { run: function() {
      var what = this.what;
      var callback = function() {};
      var stream = {
        _cleanup: function(cb) {
          cleanupCalled = true;
          assert(cb === callback, makeMsg(what, 'Wrong callback'));
        }
      };
      var cleanupCalled = false;
      var r;

      assert.strictEqual(r = utils.readInt(new Buffer([]), 0, stream, callback),
                         false,
                         makeMsg(what, 'Wrong result: ' + r));
      assert(cleanupCalled, makeMsg(what, 'Cleanup not called'));
      next();
    },
    what: 'readInt - with stream callback'
  },
  { run: function() {
      var what = this.what;
      var r;

      assert.strictEqual(r = utils.readString(new Buffer([0,0,0]), 0),
                         false,
                         makeMsg(what, 'Wrong result: ' + r));
      next();
    },
    what: 'readString - without stream callback - bad length #1'
  },
  { run: function() {
      var what = this.what;
      var r;

      assert.strictEqual(r = utils.readString(new Buffer([]), 0),
                         false,
                         makeMsg(what, 'Wrong result: ' + r));
      next();
    },
    what: 'readString - without stream callback - bad length #2'
  },
  { run: function() {
      var what = this.what;
      var r;

      assert.deepEqual(r = utils.readString(new Buffer([0,0,0,1,5]), 0),
                       new Buffer([5]),
                       makeMsg(what, 'Wrong result: ' + r));
      next();
    },
    what: 'readString - without stream callback - success'
  },
  { run: function() {
      var what = this.what;
      var r;

      assert.deepEqual(r = utils.readString(new Buffer([0,0,0,1,33]), 0, 'ascii'),
                       '!',
                       makeMsg(what, 'Wrong result: ' + r));
      next();
    },
    what: 'readString - without stream callback - encoding'
  },
  { run: function() {
      var what = this.what;
      var callback = function() {};
      var stream = {
        _cleanup: function(cb) {
          cleanupCalled = true;
          assert(cb === callback, makeMsg(what, 'Wrong callback'));
        }
      };
      var cleanupCalled = false;
      var r;

      assert.deepEqual(r = utils.readString(new Buffer([0,0,0,1]),
                                            0,
                                            stream,
                                            callback),
                       false,
                       makeMsg(what, 'Wrong result: ' + r));
      assert(cleanupCalled, makeMsg(what, 'Cleanup not called'));
      next();
    },
    what: 'readString - with stream callback - no encoding'
  },
  { run: function() {
      var what = this.what;
      var callback = function() {};
      var stream = {
        _cleanup: function(cb) {
          cleanupCalled = true;
          assert(cb === callback, makeMsg(what, 'Wrong callback'));
        }
      };
      var cleanupCalled = false;
      var r;

      assert.deepEqual(r = utils.readString(new Buffer([0,0,0,1]),
                                            0,
                                            'ascii',
                                            stream,
                                            callback),
                       false,
                       makeMsg(what, 'Wrong result: ' + r));
      assert(cleanupCalled, makeMsg(what, 'Cleanup not called'));
      next();
    },
    what: 'readString - with stream callback - encoding'
  },
  { run: function() {
      var what = this.what;
      var filepath = fixturesdir + '/encrypted-rsa.ppk';
      var passphrase = 'node.js';
      var keyInfo = utils.parseKey(fs.readFileSync(filepath));

      utils.decryptKey(keyInfo, passphrase);

      var expPrivOrig = new Buffer([
        45,45,45,45,45,66,69,71,73,78,32,82,83,65,32,80,82,73,86,65,84,69,32,75,
        69,89,45,45,45,45,45,10,77,73,73,67,87,81,73,66,65,65,75,66,103,71,115,
        70,89,82,77,66,85,68,73,109,97,52,48,98,110,101,80,66,77,48,79,86,115,
        104,119,102,109,87,115,83,57,122,72,113,88,72,108,115,122,111,81,113,68,
        82,101,89,52,103,102,51,10,112,87,112,83,78,76,116,53,70,70,78,77,80,50,
        87,107,69,68,121,70,105,71,83,115,54,77,55,72,51,102,56,108,89,72,43,108,
        120,85,51,122,56,72,99,78,103,101,121,70,80,48,52,70,98,85,77,75,83,115,
        51,67,54,51,97,108,10,115,110,97,104,107,52,71,75,117,71,69,67,118,55,71,
        112,89,87,118,102,110,110,85,87,112,118,78,111,73,104,101,107,52,113,53,
        117,118,103,82,119,106,65,75,75,107,71,88,111,47,69,116,82,74,56,101,68,
        65,103,69,108,65,111,71,65,10,85,43,71,102,72,76,118,88,69,111,122,81,49,
        109,72,65,56,77,102,99,69,109,67,83,104,76,55,83,77,86,81,78,50,119,80,
        76,56,72,102,103,73,109,89,108,55,43,97,72,112,87,69,56,100,101,49,110,
        109,100,116,119,121,54,112,50,10,52,80,89,50,80,85,89,81,57,80,89,53,55,
        105,51,122,76,56,78,90,100,56,87,81,55,82,103,48,82,66,72,68,108,110,100,
        97,70,101,70,52,69,102,48,117,76,98,111,113,89,100,47,120,78,48,114,122,
        102,121,53,53,122,55,104,87,10,79,76,43,56,86,104,111,120,84,114,66,85,
        118,118,101,79,104,90,119,66,80,107,79,101,72,102,120,109,107,86,122,51,
        120,98,98,114,103,51,107,78,108,111,48,67,81,81,68,74,89,80,75,116,67,
        115,47,108,52,54,75,74,109,78,51,108,10,85,65,78,100,73,52,81,73,117,87,
        81,43,90,108,108,122,55,112,57,52,70,102,100,111,116,110,107,118,113,71,
        43,43,66,112,49,119,79,113,74,83,67,105,104,54,85,86,105,119,76,102,118,
        112,78,90,116,71,77,67,116,107,52,54,87,78,10,104,99,48,122,65,107,69,65,
        105,65,121,78,52,87,85,115,47,48,120,52,87,111,118,71,57,53,54,74,49,65,
        43,117,83,69,75,101,87,122,117,113,102,112,71,71,98,87,103,90,57,88,102,
        110,80,110,107,43,49,65,108,56,70,79,87,49,10,116,117,57,87,87,114,77,80,
        73,97,118,81,110,90,87,47,100,88,120,104,107,101,78,87,84,72,55,56,99,81,
        74,66,65,76,107,77,43,113,122,90,103,77,86,112,90,79,48,107,115,68,113,
        65,52,72,56,90,116,53,108,81,97,102,81,109,10,115,120,67,87,70,102,43,
        108,101,53,67,110,114,97,70,113,87,78,103,104,119,82,115,70,99,112,67,84,
        116,110,52,56,54,98,97,109,121,56,57,104,115,85,100,113,105,76,50,83,54,
        121,103,97,70,111,69,67,81,70,68,107,51,114,49,101,10,119,77,56,109,106,
        77,65,51,98,50,76,77,43,65,71,77,121,72,51,43,71,80,102,53,57,113,119,
        102,76,86,88,80,77,103,101,84,90,117,98,103,84,116,55,119,52,102,54,87,
        98,65,118,111,81,83,56,67,114,119,48,97,68,86,98,72,10,118,102,76,85,86,
        98,67,119,114,57,112,49,66,77,48,67,81,70,83,66,106,67,97,47,102,122,101,
        73,67,86,107,80,70,66,97,75,81,85,109,88,106,81,51,73,99,80,84,79,114,57,
        48,109,83,65,105,80,110,65,65,112,112,83,119,84,10,106,53,83,89,83,102,
        69,57,114,83,86,98,43,69,104,81,48,104,107,50,86,75,87,73,102,111,99,78,
        72,66,68,49,77,65,78,57,122,98,52,61,10,45,45,45,45,45,69,78,68,32,82,83,
        65,32,80,82,73,86,65,84,69,32,75,69,89,45,45,45,45,45
      ]);
      assert(keyInfo.ppk === true, makeMsg(what, 'Expected PPK flag'));
      assert(keyInfo._converted === true,
             makeMsg(what, 'Expected automatic private PEM generation'));
      assert(keyInfo._macresult === true,
             makeMsg(what, 'Expected successful MAC verification'));
      assert(keyInfo._decrypted === true,
             makeMsg(what, 'Expected decrypted flag'));
      assert.deepEqual(keyInfo.privateOrig,
                       expPrivOrig,
                       makeMsg(what, 'Decrypted private PEM data mismatch'));
      next();
    },
    what: 'decryptKey - with encrypted RSA PPK'
  },
  { run: function() {
      var what = this.what;
      var filepath = fixturesdir + '/encrypted-dsa.ppk';
      var passphrase = 'node.js';
      var keyInfo = utils.parseKey(fs.readFileSync(filepath));

      utils.decryptKey(keyInfo, passphrase);

      var expPrivOrig = new Buffer([
        45,45,45,45,45,66,69,71,73,78,32,68,83,65,32,80,82,73,86,65,84,69,32,75,
        69,89,45,45,45,45,45,10,77,73,73,66,117,103,73,66,65,65,75,66,103,81,67,
        90,57,105,80,71,72,110,48,97,78,119,98,66,72,111,112,48,76,102,67,107,
        79,72,66,77,103,75,119,76,79,50,80,49,117,57,57,54,69,85,109,68,105,77,
        49,104,100,83,98,116,10,100,117,77,114,67,113,53,111,78,113,74,76,47,116,
        79,81,109,72,73,49,100,50,75,101,65,77,48,72,113,74,109,65,74,89,74,103,
        102,43,56,81,104,74,49,109,104,74,56,81,115,65,77,90,113,54,121,84,74,
        106,54,53,77,68,89,120,10,122,105,73,117,56,106,79,85,68,104,80,100,67,
        68,80,48,80,105,67,81,79,66,68,119,88,48,109,47,108,54,47,72,50,73,97,54,
        101,100,121,106,82,49,85,112,51,78,105,112,68,113,113,97,78,104,98,67,73,
        119,73,86,65,76,103,50,10,85,47,110,81,97,114,74,83,113,114,89,72,122,90,
        87,72,47,68,109,80,100,80,80,66,65,111,71,65,72,107,104,113,74,118,83,
        121,122,88,99,51,77,65,104,53,120,110,56,83,106,90,120,77,57,43,101,83,
        105,69,119,65,48,56,89,105,10,75,81,98,53,48,70,118,110,103,120,56,69,76,
        121,77,79,108,100,106,110,79,57,50,121,103,114,117,87,89,113,50,90,105,
        68,70,117,99,79,105,111,48,70,99,74,76,107,65,97,66,102,83,113,75,118,57,
        114,117,108,88,110,114,55,83,47,10,97,81,43,107,119,99,48,105,122,70,99,
        79,97,86,100,122,53,104,79,80,119,118,51,105,52,109,108,77,87,83,121,66,
        51,87,56,54,97,106,53,65,76,119,70,65,97,49,121,112,73,57,73,111,56,51,
        68,99,119,113,100,88,55,104,102,66,10,57,75,98,48,102,77,107,67,103,89,
        65,109,118,86,43,107,113,87,104,85,103,68,89,119,78,78,122,49,113,68,97,
        111,83,56,88,100,115,79,112,111,110,117,116,90,47,48,115,116,82,81,54,54,
        109,75,65,121,56,107,78,86,78,78,81,54,10,111,85,120,49,88,70,108,49,87,
        85,116,52,105,121,70,89,47,50,82,122,50,102,90,104,76,122,53,47,84,98,90,
        82,75,53,121,103,111,54,54,54,87,103,110,120,66,47,85,100,52,71,65,120,
        47,66,80,81,84,103,104,79,74,74,79,76,10,48,48,118,74,107,43,56,106,86,
        67,71,78,68,99,57,52,50,86,54,110,70,88,122,110,68,77,88,119,113,120,104,
        82,67,87,54,100,109,43,50,108,84,104,55,110,116,114,108,105,56,109,67,
        107,53,103,73,85,67,74,90,75,65,77,65,122,10,107,121,114,50,118,108,50,
        80,101,52,56,97,100,105,56,86,115,57,115,61,10,45,45,45,45,45,69,78,68,
        32,68,83,65,32,80,82,73,86,65,84,69,32,75,69,89,45,45,45,45,45,
      ]);
      assert(keyInfo.ppk === true, makeMsg(what, 'Expected PPK flag'));
      assert(keyInfo._converted === true,
             makeMsg(what, 'Expected automatic private PEM generation'));
      assert(keyInfo._macresult === true,
             makeMsg(what, 'Expected successful MAC verification'));
      assert(keyInfo._decrypted === true,
             makeMsg(what, 'Expected decrypted flag'));
      assert.deepEqual(keyInfo.privateOrig,
                       expPrivOrig,
                       makeMsg(what, 'Decrypted private PEM data mismatch'));
      next();
    },
    what: 'decryptKey - with encrypted DSA PPK'
  },
  { run: function() {
      var pubkey = [
        '---- BEGIN SSH2 PUBLIC KEY ----',
        'Comment: "dsa-key-20151028"',
        'AAAAB3NzaC1kc3MAAAEBAJ0Gth9JHw/a8RmY3Y0UFqBWVWkzWxkzG+DR2oqHwTIq',
        'jAi9Xr06oSbdmXd3Jl3bHsbd2gVq4+/j32s0uIf6FEW7mFooSiDOcRWARJSAAmkI',
        'T9ep//ag+gNUmwhtPebliCqcAn9VWE7wq2v0FJsG3trFW/pvi/hVsBOrkz4Qieqb',
        'KbwNwZc/MI+h9KAQPV7tWN2y5aG3jlVD9PERyeFPlmYkD1P+IqytxvL3thUFKeru',
        'N8w+hjKIGGonEcVzWRJ9UUBQqAaNNH4/9mzedpS8CivfnUvsIw9rSTB4N+Wf70jb',
        '6a2qD1mHs1DqOkX136UOn5HkFldBnny0NSmlR/LewQkAAAAVAMu94kPPMR0Ew6Zh',
        'mAoJJc0RjisBAAABAGkOU/b/I0opGITGCx9qFEcqiJ/VJHVsYhQgM/jCkydEc9kW',
        'yjY+wKulGWpmA8wGmYm9j4IAgMGEXjBR8dyYJNZVXK0JOJmWrqUj5Q1GCUS5hCyU',
        'iA7nmVQ4syhGE49aFBLFdyKS6t7//swEEEV+6Hw9qcQWB98zoD8qdPGz3W/9kNXB',
        'OgVHWyqfWsbA/7MW2vjjF/u2EJe8YRKIJnodLOSNwPf0iCmj1HdaIm5N2Nl1k/6/',
        '9MwlY6tjn4hinrEN/pOiC1ci/1ADmTq4L9upi1Paix51zD8Yp7q3SxOgZqFU0ELF',
        'VP/XHokm278t1mE9hxDwkepv7XgBda8uamWzwSoAAAEAYl2bjiCjIB68+DNuRgtf',
        'lvVk00nOH3dYXSslwKIFTivYDczjz0splaLsEhrdTRiOXyVsCEDhYtlvWlTw34rg',
        's2QoutpqISOiq26XwPdOlejD7Hy7gtw3yRyrhbXHYHE0nOvx0/SP7il4ub//QRTd',
        '7cUPao2f359cGpap84anqKJjF3m4oRGdZGhTAQPqtGMkchZvItKyZe6pJ9HhsE7h',
        'NMsxPHAUon8QwNL1v+JkHg7i+Oe8rEZx/51m/qGVtXLN+z885lsqzuwe9KhY5I8C',
        'C3f8nR+Mivfp1ce9pSMKCpdRASzOBuykZKYZmns6SA0UqAp7ZLDKubbhk9ZLVyAO',
        'dA==',
        '---- END SSH2 PUBLIC KEY ----'
      ].join('\n');
      assert.doesNotThrow(function() {
        var res = utils.genPublicKey(utils.parseKey(pubkey));
        assert.deepEqual(
          res,
          { type: 'dss',
            fulltype: 'ssh-dss',
            public: new Buffer([
              0x00, 0x00, 0x00, 0x07, 0x73, 0x73, 0x68, 0x2d, 0x64, 0x73, 0x73,
              0x00, 0x00, 0x01, 0x01, 0x00, 0x9d, 0x06, 0xb6, 0x1f, 0x49, 0x1f,
              0x0f, 0xda, 0xf1, 0x19, 0x98, 0xdd, 0x8d, 0x14, 0x16, 0xa0, 0x56,
              0x55, 0x69, 0x33, 0x5b, 0x19, 0x33, 0x1b, 0xe0, 0xd1, 0xda, 0x8a,
              0x87, 0xc1, 0x32, 0x2a, 0x8c, 0x08, 0xbd, 0x5e, 0xbd, 0x3a, 0xa1,
              0x26, 0xdd, 0x99, 0x77, 0x77, 0x26, 0x5d, 0xdb, 0x1e, 0xc6, 0xdd,
              0xda, 0x05, 0x6a, 0xe3, 0xef, 0xe3, 0xdf, 0x6b, 0x34, 0xb8, 0x87,
              0xfa, 0x14, 0x45, 0xbb, 0x98, 0x5a, 0x28, 0x4a, 0x20, 0xce, 0x71,
              0x15, 0x80, 0x44, 0x94, 0x80, 0x02, 0x69, 0x08, 0x4f, 0xd7, 0xa9,
              0xff, 0xf6, 0xa0, 0xfa, 0x03, 0x54, 0x9b, 0x08, 0x6d, 0x3d, 0xe6,
              0xe5, 0x88, 0x2a, 0x9c, 0x02, 0x7f, 0x55, 0x58, 0x4e, 0xf0, 0xab,
              0x6b, 0xf4, 0x14, 0x9b, 0x06, 0xde, 0xda, 0xc5, 0x5b, 0xfa, 0x6f,
              0x8b, 0xf8, 0x55, 0xb0, 0x13, 0xab, 0x93, 0x3e, 0x10, 0x89, 0xea,
              0x9b, 0x29, 0xbc, 0x0d, 0xc1, 0x97, 0x3f, 0x30, 0x8f, 0xa1, 0xf4,
              0xa0, 0x10, 0x3d, 0x5e, 0xed, 0x58, 0xdd, 0xb2, 0xe5, 0xa1, 0xb7,
              0x8e, 0x55, 0x43, 0xf4, 0xf1, 0x11, 0xc9, 0xe1, 0x4f, 0x96, 0x66,
              0x24, 0x0f, 0x53, 0xfe, 0x22, 0xac, 0xad, 0xc6, 0xf2, 0xf7, 0xb6,
              0x15, 0x05, 0x29, 0xea, 0xee, 0x37, 0xcc, 0x3e, 0x86, 0x32, 0x88,
              0x18, 0x6a, 0x27, 0x11, 0xc5, 0x73, 0x59, 0x12, 0x7d, 0x51, 0x40,
              0x50, 0xa8, 0x06, 0x8d, 0x34, 0x7e, 0x3f, 0xf6, 0x6c, 0xde, 0x76,
              0x94, 0xbc, 0x0a, 0x2b, 0xdf, 0x9d, 0x4b, 0xec, 0x23, 0x0f, 0x6b,
              0x49, 0x30, 0x78, 0x37, 0xe5, 0x9f, 0xef, 0x48, 0xdb, 0xe9, 0xad,
              0xaa, 0x0f, 0x59, 0x87, 0xb3, 0x50, 0xea, 0x3a, 0x45, 0xf5, 0xdf,
              0xa5, 0x0e, 0x9f, 0x91, 0xe4, 0x16, 0x57, 0x41, 0x9e, 0x7c, 0xb4,
              0x35, 0x29, 0xa5, 0x47, 0xf2, 0xde, 0xc1, 0x09, 0x00, 0x00, 0x00,
              0x15, 0x00, 0xcb, 0xbd, 0xe2, 0x43, 0xcf, 0x31, 0x1d, 0x04, 0xc3,
              0xa6, 0x61, 0x98, 0x0a, 0x09, 0x25, 0xcd, 0x11, 0x8e, 0x2b, 0x01,
              0x00, 0x00, 0x01, 0x00, 0x69, 0x0e, 0x53, 0xf6, 0xff, 0x23, 0x4a,
              0x29, 0x18, 0x84, 0xc6, 0x0b, 0x1f, 0x6a, 0x14, 0x47, 0x2a, 0x88,
              0x9f, 0xd5, 0x24, 0x75, 0x6c, 0x62, 0x14, 0x20, 0x33, 0xf8, 0xc2,
              0x93, 0x27, 0x44, 0x73, 0xd9, 0x16, 0xca, 0x36, 0x3e, 0xc0, 0xab,
              0xa5, 0x19, 0x6a, 0x66, 0x03, 0xcc, 0x06, 0x99, 0x89, 0xbd, 0x8f,
              0x82, 0x00, 0x80, 0xc1, 0x84, 0x5e, 0x30, 0x51, 0xf1, 0xdc, 0x98,
              0x24, 0xd6, 0x55, 0x5c, 0xad, 0x09, 0x38, 0x99, 0x96, 0xae, 0xa5,
              0x23, 0xe5, 0x0d, 0x46, 0x09, 0x44, 0xb9, 0x84, 0x2c, 0x94, 0x88,
              0x0e, 0xe7, 0x99, 0x54, 0x38, 0xb3, 0x28, 0x46, 0x13, 0x8f, 0x5a,
              0x14, 0x12, 0xc5, 0x77, 0x22, 0x92, 0xea, 0xde, 0xff, 0xfe, 0xcc,
              0x04, 0x10, 0x45, 0x7e, 0xe8, 0x7c, 0x3d, 0xa9, 0xc4, 0x16, 0x07,
              0xdf, 0x33, 0xa0, 0x3f, 0x2a, 0x74, 0xf1, 0xb3, 0xdd, 0x6f, 0xfd,
              0x90, 0xd5, 0xc1, 0x3a, 0x05, 0x47, 0x5b, 0x2a, 0x9f, 0x5a, 0xc6,
              0xc0, 0xff, 0xb3, 0x16, 0xda, 0xf8, 0xe3, 0x17, 0xfb, 0xb6, 0x10,
              0x97, 0xbc, 0x61, 0x12, 0x88, 0x26, 0x7a, 0x1d, 0x2c, 0xe4, 0x8d,
              0xc0, 0xf7, 0xf4, 0x88, 0x29, 0xa3, 0xd4, 0x77, 0x5a, 0x22, 0x6e,
              0x4d, 0xd8, 0xd9, 0x75, 0x93, 0xfe, 0xbf, 0xf4, 0xcc, 0x25, 0x63,
              0xab, 0x63, 0x9f, 0x88, 0x62, 0x9e, 0xb1, 0x0d, 0xfe, 0x93, 0xa2,
              0x0b, 0x57, 0x22, 0xff, 0x50, 0x03, 0x99, 0x3a, 0xb8, 0x2f, 0xdb,
              0xa9, 0x8b, 0x53, 0xda, 0x8b, 0x1e, 0x75, 0xcc, 0x3f, 0x18, 0xa7,
              0xba, 0xb7, 0x4b, 0x13, 0xa0, 0x66, 0xa1, 0x54, 0xd0, 0x42, 0xc5,
              0x54, 0xff, 0xd7, 0x1e, 0x89, 0x26, 0xdb, 0xbf, 0x2d, 0xd6, 0x61,
              0x3d, 0x87, 0x10, 0xf0, 0x91, 0xea, 0x6f, 0xed, 0x78, 0x01, 0x75,
              0xaf, 0x2e, 0x6a, 0x65, 0xb3, 0xc1, 0x2a, 0x00, 0x00, 0x01, 0x00,
              0x62, 0x5d, 0x9b, 0x8e, 0x20, 0xa3, 0x20, 0x1e, 0xbc, 0xf8, 0x33,
              0x6e, 0x46, 0x0b, 0x5f, 0x96, 0xf5, 0x64, 0xd3, 0x49, 0xce, 0x1f,
              0x77, 0x58, 0x5d, 0x2b, 0x25, 0xc0, 0xa2, 0x05, 0x4e, 0x2b, 0xd8,
              0x0d, 0xcc, 0xe3, 0xcf, 0x4b, 0x29, 0x95, 0xa2, 0xec, 0x12, 0x1a,
              0xdd, 0x4d, 0x18, 0x8e, 0x5f, 0x25, 0x6c, 0x08, 0x40, 0xe1, 0x62,
              0xd9, 0x6f, 0x5a, 0x54, 0xf0, 0xdf, 0x8a, 0xe0, 0xb3, 0x64, 0x28,
              0xba, 0xda, 0x6a, 0x21, 0x23, 0xa2, 0xab, 0x6e, 0x97, 0xc0, 0xf7,
              0x4e, 0x95, 0xe8, 0xc3, 0xec, 0x7c, 0xbb, 0x82, 0xdc, 0x37, 0xc9,
              0x1c, 0xab, 0x85, 0xb5, 0xc7, 0x60, 0x71, 0x34, 0x9c, 0xeb, 0xf1,
              0xd3, 0xf4, 0x8f, 0xee, 0x29, 0x78, 0xb9, 0xbf, 0xff, 0x41, 0x14,
              0xdd, 0xed, 0xc5, 0x0f, 0x6a, 0x8d, 0x9f, 0xdf, 0x9f, 0x5c, 0x1a,
              0x96, 0xa9, 0xf3, 0x86, 0xa7, 0xa8, 0xa2, 0x63, 0x17, 0x79, 0xb8,
              0xa1, 0x11, 0x9d, 0x64, 0x68, 0x53, 0x01, 0x03, 0xea, 0xb4, 0x63,
              0x24, 0x72, 0x16, 0x6f, 0x22, 0xd2, 0xb2, 0x65, 0xee, 0xa9, 0x27,
              0xd1, 0xe1, 0xb0, 0x4e, 0xe1, 0x34, 0xcb, 0x31, 0x3c, 0x70, 0x14,
              0xa2, 0x7f, 0x10, 0xc0, 0xd2, 0xf5, 0xbf, 0xe2, 0x64, 0x1e, 0x0e,
              0xe2, 0xf8, 0xe7, 0xbc, 0xac, 0x46, 0x71, 0xff, 0x9d, 0x66, 0xfe,
              0xa1, 0x95, 0xb5, 0x72, 0xcd, 0xfb, 0x3f, 0x3c, 0xe6, 0x5b, 0x2a,
              0xce, 0xec, 0x1e, 0xf4, 0xa8, 0x58, 0xe4, 0x8f, 0x02, 0x0b, 0x77,
              0xfc, 0x9d, 0x1f, 0x8c, 0x8a, 0xf7, 0xe9, 0xd5, 0xc7, 0xbd, 0xa5,
              0x23, 0x0a, 0x0a, 0x97, 0x51, 0x01, 0x2c, 0xce, 0x06, 0xec, 0xa4,
              0x64, 0xa6, 0x19, 0x9a, 0x7b, 0x3a, 0x48, 0x0d, 0x14, 0xa8, 0x0a,
              0x7b, 0x64, 0xb0, 0xca, 0xb9, 0xb6, 0xe1, 0x93, 0xd6, 0x4b, 0x57,
              0x20, 0x0e, 0x74,
            ]),
            publicOrig: new Buffer([
              0x2d, 0x2d, 0x2d, 0x2d, 0x2d, 0x42, 0x45, 0x47, 0x49, 0x4e, 0x20,
              0x50, 0x55, 0x42, 0x4c, 0x49, 0x43, 0x20, 0x4b, 0x45, 0x59, 0x2d,
              0x2d, 0x2d, 0x2d, 0x2d, 0x0a, 0x4d, 0x49, 0x49, 0x44, 0x4f, 0x6a,
              0x43, 0x43, 0x41, 0x69, 0x30, 0x47, 0x42, 0x79, 0x71, 0x47, 0x53,
              0x4d, 0x34, 0x34, 0x42, 0x41, 0x45, 0x77, 0x67, 0x67, 0x49, 0x67,
              0x41, 0x6f, 0x49, 0x42, 0x41, 0x51, 0x43, 0x64, 0x42, 0x72, 0x59,
              0x66, 0x53, 0x52, 0x38, 0x50, 0x32, 0x76, 0x45, 0x5a, 0x6d, 0x4e,
              0x32, 0x4e, 0x46, 0x42, 0x61, 0x67, 0x56, 0x6c, 0x56, 0x70, 0x4d,
              0x31, 0x73, 0x5a, 0x0a, 0x4d, 0x78, 0x76, 0x67, 0x30, 0x64, 0x71,
              0x4b, 0x68, 0x38, 0x45, 0x79, 0x4b, 0x6f, 0x77, 0x49, 0x76, 0x56,
              0x36, 0x39, 0x4f, 0x71, 0x45, 0x6d, 0x33, 0x5a, 0x6c, 0x33, 0x64,
              0x79, 0x5a, 0x64, 0x32, 0x78, 0x37, 0x47, 0x33, 0x64, 0x6f, 0x46,
              0x61, 0x75, 0x50, 0x76, 0x34, 0x39, 0x39, 0x72, 0x4e, 0x4c, 0x69,
              0x48, 0x2b, 0x68, 0x52, 0x46, 0x75, 0x35, 0x68, 0x61, 0x4b, 0x45,
              0x6f, 0x67, 0x0a, 0x7a, 0x6e, 0x45, 0x56, 0x67, 0x45, 0x53, 0x55,
              0x67, 0x41, 0x4a, 0x70, 0x43, 0x45, 0x2f, 0x58, 0x71, 0x66, 0x2f,
              0x32, 0x6f, 0x50, 0x6f, 0x44, 0x56, 0x4a, 0x73, 0x49, 0x62, 0x54,
              0x33, 0x6d, 0x35, 0x59, 0x67, 0x71, 0x6e, 0x41, 0x4a, 0x2f, 0x56,
              0x56, 0x68, 0x4f, 0x38, 0x4b, 0x74, 0x72, 0x39, 0x42, 0x53, 0x62,
              0x42, 0x74, 0x37, 0x61, 0x78, 0x56, 0x76, 0x36, 0x62, 0x34, 0x76,
              0x34, 0x0a, 0x56, 0x62, 0x41, 0x54, 0x71, 0x35, 0x4d, 0x2b, 0x45,
              0x49, 0x6e, 0x71, 0x6d, 0x79, 0x6d, 0x38, 0x44, 0x63, 0x47, 0x58,
              0x50, 0x7a, 0x43, 0x50, 0x6f, 0x66, 0x53, 0x67, 0x45, 0x44, 0x31,
              0x65, 0x37, 0x56, 0x6a, 0x64, 0x73, 0x75, 0x57, 0x68, 0x74, 0x34,
              0x35, 0x56, 0x51, 0x2f, 0x54, 0x78, 0x45, 0x63, 0x6e, 0x68, 0x54,
              0x35, 0x5a, 0x6d, 0x4a, 0x41, 0x39, 0x54, 0x2f, 0x69, 0x4b, 0x73,
              0x0a, 0x72, 0x63, 0x62, 0x79, 0x39, 0x37, 0x59, 0x56, 0x42, 0x53,
              0x6e, 0x71, 0x37, 0x6a, 0x66, 0x4d, 0x50, 0x6f, 0x59, 0x79, 0x69,
              0x42, 0x68, 0x71, 0x4a, 0x78, 0x48, 0x46, 0x63, 0x31, 0x6b, 0x53,
              0x66, 0x56, 0x46, 0x41, 0x55, 0x4b, 0x67, 0x47, 0x6a, 0x54, 0x52,
              0x2b, 0x50, 0x2f, 0x5a, 0x73, 0x33, 0x6e, 0x61, 0x55, 0x76, 0x41,
              0x6f, 0x72, 0x33, 0x35, 0x31, 0x4c, 0x37, 0x43, 0x4d, 0x50, 0x0a,
              0x61, 0x30, 0x6b, 0x77, 0x65, 0x44, 0x66, 0x6c, 0x6e, 0x2b, 0x39,
              0x49, 0x32, 0x2b, 0x6d, 0x74, 0x71, 0x67, 0x39, 0x5a, 0x68, 0x37,
              0x4e, 0x51, 0x36, 0x6a, 0x70, 0x46, 0x39, 0x64, 0x2b, 0x6c, 0x44,
              0x70, 0x2b, 0x52, 0x35, 0x42, 0x5a, 0x58, 0x51, 0x5a, 0x35, 0x38,
              0x74, 0x44, 0x55, 0x70, 0x70, 0x55, 0x66, 0x79, 0x33, 0x73, 0x45,
              0x4a, 0x41, 0x68, 0x55, 0x41, 0x79, 0x37, 0x33, 0x69, 0x0a, 0x51,
              0x38, 0x38, 0x78, 0x48, 0x51, 0x54, 0x44, 0x70, 0x6d, 0x47, 0x59,
              0x43, 0x67, 0x6b, 0x6c, 0x7a, 0x52, 0x47, 0x4f, 0x4b, 0x77, 0x45,
              0x43, 0x67, 0x67, 0x45, 0x41, 0x61, 0x51, 0x35, 0x54, 0x39, 0x76,
              0x38, 0x6a, 0x53, 0x69, 0x6b, 0x59, 0x68, 0x4d, 0x59, 0x4c, 0x48,
              0x32, 0x6f, 0x55, 0x52, 0x79, 0x71, 0x49, 0x6e, 0x39, 0x55, 0x6b,
              0x64, 0x57, 0x78, 0x69, 0x46, 0x43, 0x41, 0x7a, 0x0a, 0x2b, 0x4d,
              0x4b, 0x54, 0x4a, 0x30, 0x52, 0x7a, 0x32, 0x52, 0x62, 0x4b, 0x4e,
              0x6a, 0x37, 0x41, 0x71, 0x36, 0x55, 0x5a, 0x61, 0x6d, 0x59, 0x44,
              0x7a, 0x41, 0x61, 0x5a, 0x69, 0x62, 0x32, 0x50, 0x67, 0x67, 0x43,
              0x41, 0x77, 0x59, 0x52, 0x65, 0x4d, 0x46, 0x48, 0x78, 0x33, 0x4a,
              0x67, 0x6b, 0x31, 0x6c, 0x56, 0x63, 0x72, 0x51, 0x6b, 0x34, 0x6d,
              0x5a, 0x61, 0x75, 0x70, 0x53, 0x50, 0x6c, 0x0a, 0x44, 0x55, 0x59,
              0x4a, 0x52, 0x4c, 0x6d, 0x45, 0x4c, 0x4a, 0x53, 0x49, 0x44, 0x75,
              0x65, 0x5a, 0x56, 0x44, 0x69, 0x7a, 0x4b, 0x45, 0x59, 0x54, 0x6a,
              0x31, 0x6f, 0x55, 0x45, 0x73, 0x56, 0x33, 0x49, 0x70, 0x4c, 0x71,
              0x33, 0x76, 0x2f, 0x2b, 0x7a, 0x41, 0x51, 0x51, 0x52, 0x58, 0x37,
              0x6f, 0x66, 0x44, 0x32, 0x70, 0x78, 0x42, 0x59, 0x48, 0x33, 0x7a,
              0x4f, 0x67, 0x50, 0x79, 0x70, 0x30, 0x0a, 0x38, 0x62, 0x50, 0x64,
              0x62, 0x2f, 0x32, 0x51, 0x31, 0x63, 0x45, 0x36, 0x42, 0x55, 0x64,
              0x62, 0x4b, 0x70, 0x39, 0x61, 0x78, 0x73, 0x44, 0x2f, 0x73, 0x78,
              0x62, 0x61, 0x2b, 0x4f, 0x4d, 0x58, 0x2b, 0x37, 0x59, 0x51, 0x6c,
              0x37, 0x78, 0x68, 0x45, 0x6f, 0x67, 0x6d, 0x65, 0x68, 0x30, 0x73,
              0x35, 0x49, 0x33, 0x41, 0x39, 0x2f, 0x53, 0x49, 0x4b, 0x61, 0x50,
              0x55, 0x64, 0x31, 0x6f, 0x69, 0x0a, 0x62, 0x6b, 0x33, 0x59, 0x32,
              0x58, 0x57, 0x54, 0x2f, 0x72, 0x2f, 0x30, 0x7a, 0x43, 0x56, 0x6a,
              0x71, 0x32, 0x4f, 0x66, 0x69, 0x47, 0x4b, 0x65, 0x73, 0x51, 0x33,
              0x2b, 0x6b, 0x36, 0x49, 0x4c, 0x56, 0x79, 0x4c, 0x2f, 0x55, 0x41,
              0x4f, 0x5a, 0x4f, 0x72, 0x67, 0x76, 0x32, 0x36, 0x6d, 0x4c, 0x55,
              0x39, 0x71, 0x4c, 0x48, 0x6e, 0x58, 0x4d, 0x50, 0x78, 0x69, 0x6e,
              0x75, 0x72, 0x64, 0x4c, 0x0a, 0x45, 0x36, 0x42, 0x6d, 0x6f, 0x56,
              0x54, 0x51, 0x51, 0x73, 0x56, 0x55, 0x2f, 0x39, 0x63, 0x65, 0x69,
              0x53, 0x62, 0x62, 0x76, 0x79, 0x33, 0x57, 0x59, 0x54, 0x32, 0x48,
              0x45, 0x50, 0x43, 0x52, 0x36, 0x6d, 0x2f, 0x74, 0x65, 0x41, 0x46,
              0x31, 0x72, 0x79, 0x35, 0x71, 0x5a, 0x62, 0x50, 0x42, 0x4b, 0x67,
              0x4f, 0x43, 0x41, 0x51, 0x55, 0x41, 0x41, 0x6f, 0x49, 0x42, 0x41,
              0x47, 0x4a, 0x64, 0x0a, 0x6d, 0x34, 0x34, 0x67, 0x6f, 0x79, 0x41,
              0x65, 0x76, 0x50, 0x67, 0x7a, 0x62, 0x6b, 0x59, 0x4c, 0x58, 0x35,
              0x62, 0x31, 0x5a, 0x4e, 0x4e, 0x4a, 0x7a, 0x68, 0x39, 0x33, 0x57,
              0x46, 0x30, 0x72, 0x4a, 0x63, 0x43, 0x69, 0x42, 0x55, 0x34, 0x72,
              0x32, 0x41, 0x33, 0x4d, 0x34, 0x38, 0x39, 0x4c, 0x4b, 0x5a, 0x57,
              0x69, 0x37, 0x42, 0x49, 0x61, 0x33, 0x55, 0x30, 0x59, 0x6a, 0x6c,
              0x38, 0x6c, 0x0a, 0x62, 0x41, 0x68, 0x41, 0x34, 0x57, 0x4c, 0x5a,
              0x62, 0x31, 0x70, 0x55, 0x38, 0x4e, 0x2b, 0x4b, 0x34, 0x4c, 0x4e,
              0x6b, 0x4b, 0x4c, 0x72, 0x61, 0x61, 0x69, 0x45, 0x6a, 0x6f, 0x71,
              0x74, 0x75, 0x6c, 0x38, 0x44, 0x33, 0x54, 0x70, 0x58, 0x6f, 0x77,
              0x2b, 0x78, 0x38, 0x75, 0x34, 0x4c, 0x63, 0x4e, 0x38, 0x6b, 0x63,
              0x71, 0x34, 0x57, 0x31, 0x78, 0x32, 0x42, 0x78, 0x4e, 0x4a, 0x7a,
              0x72, 0x0a, 0x38, 0x64, 0x50, 0x30, 0x6a, 0x2b, 0x34, 0x70, 0x65,
              0x4c, 0x6d, 0x2f, 0x2f, 0x30, 0x45, 0x55, 0x33, 0x65, 0x33, 0x46,
              0x44, 0x32, 0x71, 0x4e, 0x6e, 0x39, 0x2b, 0x66, 0x58, 0x42, 0x71,
              0x57, 0x71, 0x66, 0x4f, 0x47, 0x70, 0x36, 0x69, 0x69, 0x59, 0x78,
              0x64, 0x35, 0x75, 0x4b, 0x45, 0x52, 0x6e, 0x57, 0x52, 0x6f, 0x55,
              0x77, 0x45, 0x44, 0x36, 0x72, 0x52, 0x6a, 0x4a, 0x48, 0x49, 0x57,
              0x0a, 0x62, 0x79, 0x4c, 0x53, 0x73, 0x6d, 0x58, 0x75, 0x71, 0x53,
              0x66, 0x52, 0x34, 0x62, 0x42, 0x4f, 0x34, 0x54, 0x54, 0x4c, 0x4d,
              0x54, 0x78, 0x77, 0x46, 0x4b, 0x4a, 0x2f, 0x45, 0x4d, 0x44, 0x53,
              0x39, 0x62, 0x2f, 0x69, 0x5a, 0x42, 0x34, 0x4f, 0x34, 0x76, 0x6a,
              0x6e, 0x76, 0x4b, 0x78, 0x47, 0x63, 0x66, 0x2b, 0x64, 0x5a, 0x76,
              0x36, 0x68, 0x6c, 0x62, 0x56, 0x79, 0x7a, 0x66, 0x73, 0x2f, 0x0a,
              0x50, 0x4f, 0x5a, 0x62, 0x4b, 0x73, 0x37, 0x73, 0x48, 0x76, 0x53,
              0x6f, 0x57, 0x4f, 0x53, 0x50, 0x41, 0x67, 0x74, 0x33, 0x2f, 0x4a,
              0x30, 0x66, 0x6a, 0x49, 0x72, 0x33, 0x36, 0x64, 0x58, 0x48, 0x76,
              0x61, 0x55, 0x6a, 0x43, 0x67, 0x71, 0x58, 0x55, 0x51, 0x45, 0x73,
              0x7a, 0x67, 0x62, 0x73, 0x70, 0x47, 0x53, 0x6d, 0x47, 0x5a, 0x70,
              0x37, 0x4f, 0x6b, 0x67, 0x4e, 0x46, 0x4b, 0x67, 0x4b, 0x0a, 0x65,
              0x32, 0x53, 0x77, 0x79, 0x72, 0x6d, 0x32, 0x34, 0x5a, 0x50, 0x57,
              0x53, 0x31, 0x63, 0x67, 0x44, 0x6e, 0x51, 0x3d, 0x0a, 0x2d, 0x2d,
              0x2d, 0x2d, 0x2d, 0x45, 0x4e, 0x44, 0x20, 0x50, 0x55, 0x42, 0x4c,
              0x49, 0x43, 0x20, 0x4b, 0x45, 0x59, 0x2d, 0x2d, 0x2d, 0x2d, 0x2d
            ])
          }
        );
        next();
      });
    },
    what: 'Generate public key from parsed public key'
  },
];

function next() {
  if (Array.isArray(process._events.exit))
    process._events.exit = process._events.exit[1];
  if (++t === tests.length)
    return;

  var v = tests[t];
  v.run.call(v);
}

function makeMsg(what, msg) {
  return '[' + group + what + ']: ' + msg;
}

process.once('exit', function() {
  assert(t === tests.length,
         makeMsg('_exit',
                 'Only finished ' + t + '/' + tests.length + ' tests'));
});

next();
