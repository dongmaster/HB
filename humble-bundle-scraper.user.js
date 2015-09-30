// ==UserScript==
// @name        Humble Bundle Scraper
// @namespace   humblebundle.scraper
// @description Scrapes every game link on your Humble Bundle account page.
// @include     https://www.humblebundle.com/home
// @match       https://www.humblebundle.com/home
// @version     4
// @grant       none
// @author      Dongmaster
// ==/UserScript==
/* Copyright (c) 2015, Dongmaster
All rights reserved.

Redistribution and use in source and binary forms, with or without modification, are permitted provided that the following conditions are met:

1. Redistributions of source code must retain the above copyright notice, this list of conditions and the following disclaimer.

2. Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or other materials provided with the distribution.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
*/





// Do not edit the code below unless you know what you are doing.
var vidya,
    vidya_length,
    os_buttons,
    os_buttons_length,
    redundancy_check,
    counter,
    scrape_result;

function prepare_scraping() {
  vidya = document.getElementsByClassName('row');
  vidya_length = vidya.length;

  os_buttons = document.getElementsByClassName('dlplatform-list')[0].children;
  os_buttons_length = os_buttons.length;

  redundancy_check = 0;
  counter = 0;
  
  scrape_result = '';
  scrape_result += "Links expire in 12-24 hours. These links were generated on: " + new Date().toString() + "\n\n";
  scrape_result += "Attempting to download them with wget, curl or other command-line tools will result in failure. Open these links with your browser and it should work.";
  
  start_scraping();
}

function start_scraping() {
  console.log('Scraping...');
  $(os_buttons[counter]).trigger('click')
    
  var os = os_buttons[counter].getAttribute('class');
  os = os.replace('flexbtn', '');
  os = os.replace('active', '');
  os = os.toUpperCase();
  scrape_result += '\n\n ###' + os + '###\n';
  
  setTimeout(function() {
    setTimeout(function() {
      $(document.getElementById('show_android_binaries')).trigger('click');
    }, 1000);
    
    vidya = document.getElementsByClassName('row');
    vidya_length = vidya.length;
    
    for(var i = 0; i < vidya_length; i++) {
      var btn = vidya[i].getElementsByClassName('a');
      
      for(var k = 0 ; k < btn.length; k++) {
        if(btn[k].offsetParent != null) {
          if(redundancy_check === 0) {
            scrape_result += '\n\n';
            scrape_result += vidya[i].getAttribute('data-human-name').replace('<br>', '');
          }
          
          scrape_result += btn[k].innerHTML + ' ' + btn[k].getAttribute('href');
          
          redundancy_check++;
        }
      }
      redundancy_check = 0;
    }
    
    if(counter < os_buttons_length) {
      start_scraping();
      counter++;
    } else {
      //End of script.
      console.log(scrape_result);
      document.getElementById("humblescraper_output").value = scrape_result;
    }
  }, 5000);
}


function append_elements() {
  $(document.getElementsByClassName('dltype')[0]).append('<div class="flexbtn active" id="humblescraper_scrape_button"><div class="icon"></div><div class="right"></div> <span class="label">Scrape</span><a class="a" href="#">Scrape</a></div>');
  document.getElementById('humblescraper_scrape_button').addEventListener('click', prepare_scraping, true);
  //$(document.getElementsByClassName("platform-chooser")[0]).append('<textarea>ayy lmao</textarea>');
  var platform_chooser = document.getElementsByClassName("platform-chooser")[0];

  var elem = document.createElement("textarea");
  var elem_text = document.createTextNode("The links will go here after you've pressed the scrape button. It takes a while to scrape the page (5 seconds per category. This is to make sure that every link is included and that the html on the page has been updated). Please be patient.");

  elem.id = "humblescraper_output";
  elem.style.height = "200px";
  elem.style.width = "400px";
  elem.appendChild(elem_text);

  platform_chooser.appendChild(elem);
}

// Adds the Scrape button and the textarea to the page.
function check_elements() {
  setTimeout(function() {
    if(!document.getElementById("humblescraper_scrape_button")) {
      append_elements();
      console.log("lmao");
    } else {
      check_elements();
      console.log("lel");
    }
    
    if(!document.getElementById("humblescraper_scrape_button")) {
      check_elements()
    }
  }, 2000);
  console.log("help");
}


setTimeout(function() {
  if(!document.getElementById("humblescraper_scrape_button")) {
    append_elements();
  }
}, 8000);

(function() {
    var state = document.readyState;
    if(state === 'interactive' || state === 'complete') {
        check_elements();
    }
    else setTimeout(arguments.callee, 100);
})();
