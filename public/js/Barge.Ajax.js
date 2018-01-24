/**
 * Created by ARCH on 2/16/17.
 * @Copyright (C) 2016
 * Barge Studios Inc, The Bumble-Bee Authors
 * <bargestd@gmail.com>
 * <bumble.bee@bargestd.com>
 *
 * @licence Licensed under the Barge Studios Eula
 *  you may not use this file except in compliance with the License.
 *
 * You may obtain a copy of the License at
 *     http://www.bargestudios.com/bumblebee/licence
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS-IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 *        \__/
 *    \  (-_-)  /
 *    \-( ___)-/
 *     ( ____)
 *   <-(____)->
 *    \      /
 * @fileOverview constructor and associated methods for creating and managing
 * a tabbed view
 * @requires {@link Barge.utils, @link  Barge.String, @link  Barge.Object, @link  Barge.Dom<*>, @link Barge.Timer}
 *
 *
 * @user msg: Some lines in this file use constructs from es6 or later
 */
var Barge = Barge || {};

(function (global, factory)
{
   if (typeof define === 'function' && define.amd)
   {
      // AMD. Register as an anonymous module unless amdModuleId is set
      define([], function ()
      {
         return (global['Barge.Ajax'] = factory(global));
      });
   }
   else if (typeof exports === 'object')
   {
      // Node. Does not work with strict CommonJS, but
      // only CommonJS-like environments that support module.exports,
      // like Node.
      module.exports = factory(global);
   }
   else
   {
      global['Barge.Ajax'] = factory(global);
   }
})(typeof window !== undefined ? window : this, function factory(window)
{
   "use strict";

   let Bu = Barge.utils; //'ts all we need
   /**
    *
    * @type {{}}
    */
   Barge.Ajax = Barge.Ajax || {};

   /**
    *
    * @param options
    * @constructor
    */
   function Ajax(options = null)
   {
      this.options = {
         baseUrl : "",
         data : null,
         method : "GET"
      };

      if (options)
      {
         this.options = Bu.extend(this.options, options);
      }
   }

   /**
    *
    * @returns {XMLHttpRequest}
    */
  Ajax.prototype.createXHR = function ()
   {
      let xhr = null;

      try
      {
         if (window.XMLHttpRequest)
         {
            xhr = new XMLHttpRequest();
         }
         else if (window.ActiveXObject)
         {
            xhr = new ActiveXObject("Microsoft.XMLHTTP")
         }
      }
      catch (e)
      {
         xhr = null;
      }

      return xhr;
   };

   /**
    *
    * @param options{{url : string, method : string,
      target : Element, title : string,
      error : fn,  success : fn,
      abort : fn,
      progress : fn,
      progressElement : Element|null
      data: {},
      timeout : Number<Milliseconds>,
      headers : {header : String}
      }}
    * @param callback {fn}
    * @returns {XMLHttpRequest}
    */
   Ajax.prototype.send = function (options, callback = null)
   {
      let request = this.createXHR(),
      self = this;
      this.request = request;

      if (options)
      {
         this.options = Bu.extend(this.options, options);
      }

      request.onreadystatechange = function ()
      {
         if (request.readyState === 4 && request.status === 200)
         {
            if(self.options.success)
            {
               self.options.success(request);
            }
            else if(callback)
            {
               callback(request);
            }
         }

         //if(Bu.defined(options.progressElement))
         //{
         //   let prEl = document.getElementsByClassName(options.progressElement)[0];
         //   console.log(prEl);
         //
         //   switch (request.readyState)
         //   {
               //case 1:
               //{
               //   Barge.Dom.css(prEl, {width : "25%"});
               //   break;
               //}
               //case 2:
               //{
               //   Barge.Dom.css(prEl, {width : "50%"});
               //   break;
               //}
               //case 3:
               //{
               //   Barge.Dom.css(prEl, {width : "75%"});
               //   break;
               //}
               //case 4:
               //{
               //   Barge.Dom.css(prEl, {width : "100%"})
               //}
            //}
         //}
      };

      request.onerror = function ()
      {
         if(Bu.defined(self.options.error))
         {
            self.options.error(request)
         }
      };
      //
      request.onabort = function ()
      {
         if(Bu.defined(self.options.abort))
         {
            self.options.abort(request)
         }
      };
      //
      request.onprogress = function ()
      {
         if(Bu.defined(self.options.progress))
         {
            self.options.progress(request);
         }
         else if(Bu.defined(self.options.onProgress))
         {
            self.options.onProgress(request);
         }
      };

      if(Bu.defined(self.options.timeout))
      {
         let timer = setTimeout(function ()
                    {
                     request.abort();
                     clearTimeout(timer)
                    }, self.options.timeout)
      }


      //console.log(this.options.method, this.options.url, this.options.data);

      request.open(this.options.method,
                   this.options.baseUrl + this.options.url + self.toQueryString(self.options.data), true);

      if(Bu.defined(self.options.headers))
      {
         for(let header in self.options.headers)
         {
            request.setRequestHeader(header, self.options.headers[header])
         }
      }

      request.send(self.options.data);

      //this.setHeaders(request, self.options.headers);

      return request;
   };

   //Ajax.prototype.send = function ()
   //{
   //
   //};

   Ajax.prototype.getQueryString = function (object)
   {
      let self = this, qString = "?", i = 0;

      for (let key in object)
      {
         qString += ( i > 0 ? "&" : "")+ key + "=" + self.encode(object[key]);
         i++;
      }

      return qString
      //Object.keys(object).reduce(function (acc, item){//var prefix = ;//return (!acc ? '' : acc + '&') +
      // self.encode(item) + '=' + self.encode(object[item])//}, '')
   };

   Ajax.prototype.encode = function(value)
   {
      return encodeURIComponent(value)
   };

   Ajax.prototype.hasContentType = function (headers)
   {
      //return Bu.defined(headers["Content-Type"])
      return Object.keys(headers).some(function (name)
      {return name.toLowerCase() === 'content-type'})
   };

   Ajax.prototype.setHeaders =function (xhr, headers = {})
   {
      //headers = headers || {};
      if (!this.hasContentType(headers))
      {
         headers['Content-Type'] = 'application/x-www-form-urlencoded'
      }
      Object.keys(headers).forEach(function (name)
                                   {
                                      (headers[name] && xhr.setRequestHeader(name, headers[name]))
                                   })
   };

   /**
    *
    * @param header
    * @param value
    */
   Ajax.prototype.setRequestHeader =function (header, value){
      this.request.setRequestHeader(header, value);
   };

   Ajax.prototype.toQueryString =function (data)
   {
      return Bu.isObject(data) ? this.getQueryString(data) : data
   };


   /**
    * todo write an ajax dialog form opener constructor for els with attr data-jx-dgf="<url>, <method>"
    * add overlay
    *
    * if the dialog host (fdg) isnt already loaded load
    *
    * edit heading
    *
    * load form and insert into dialog
    */

   //going public whoop! whoop! lol
   return Barge.Ajax = Ajax;
});



