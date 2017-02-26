  function bidi(chars) {
        if (chars) {
          var specialChars = [32, 33, 58, 40, 41, 63 ];
          var dic = [];
          chars = chars.split('');
          //replace chars 40 with 41 and vise versa
          for (var i=0; i < chars.length; i++) {
            if (chars[i].charCodeAt(0) === 40)
              chars[i] = String.fromCharCode(41);
              else if (chars[i].charCodeAt(0) === 41)
              chars[i] = String.fromCharCode(40);
          }

          var lastSet = 'ltr';
          //array of rtl/ltr objects
          for (var i = 0, len = chars.length-1; i <= len; i++) {
            if (
              (chars[i].charCodeAt(0) >= 1488 && chars[i].charCodeAt(0) <= 1514)
              ||
              (chars[i].charCodeAt(0) >= 48 && chars[i].charCodeAt(0) <= 57)
            ) {
              if (lastSet !== 'rtl') {
                dic.push({
                  dir: 'rtl',
                  chars: [chars[i]]
                })
              } else {
                dic[dic.length-1].chars.push(chars[i]);
              }
              lastSet = 'rtl';
            } else if (specialChars.indexOf(chars[i].charCodeAt(0)) > -1) {
              if (lastSet !== 'other') {
                dic.push({
                    dir: 'other',
                    chars: [chars[i]]
                  });
              }  else if (dic[dic.length-1].chars[0] == chars[i]) {
                  dic[dic.length-1].chars.push(chars[i]);

              }else {
                dic.push({
                    dir: 'other',
                    chars: [chars[i]]
                  });
              }
                lastSet = 'other';
            } else {
              if (lastSet !== 'ltr' || i ===0) {
                dic.push({
                  dir: 'ltr',
                  chars: [chars[i]]
                })
              } else {
                dic[dic.length-1].chars.push(chars[i]);
              }
              
              lastSet = 'ltr';
            }
          }
        }
       
        if (dic) {
          for (var i=dic.length-1; i > 1; i--) {
            if (dic[i-2].dir === 'ltr' && dic[i-1].dir === 'other' && dic[i].dir === 'ltr') {
              dic[i-2].chars = dic[i-2].chars.concat(dic[i-1].chars);
              dic[i-2].chars = dic[i-2].chars.concat(dic[i].chars);
              dic.splice(i, 1);
              dic.splice(i-1, 1);
              i--;
            }
          }
   
          for (var i = dic.length-1, len = 0; i >= len; i--) {
            if (dic[i].dir === 'rtl') {
                var str = dic[i].chars.join('');
                width = ctx.measureText(str).width;
                ctx[method](str, left, top);
                left += width > 0 ? width : 0;
            } else if (dic[i].dir === 'ltr' || dic[i].dir === 'other') {
                var str = dic[i].chars.join('');
                
                width = ctx.measureText(str).width;
                ctx[method](str, left, top);
                left += width > 0 ? width : 0;
            }
            
          }
        }
}
 