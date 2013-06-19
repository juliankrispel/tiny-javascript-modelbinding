(function(){
    var DomBinder = function(opts){
        this.init(opts);
    }

    _(DomBinder.prototype).extend({
        defaults: {
            element: null,
            model: null
        },

        init: function(opts){
            // Bind context of methods to this
            _(this).bindAll('bindModelToDom', 'bindDomToModel', 'updateModelToDom', 'updateDomToModel');

            _(this).extend(_(this.defaults).extend(opts));
            if(!this.element && !this.model) throw('Both opts.element and opts.model must be defined');
            else{
                this.bindModelToDom();
                this.bindDomToModel();
            }
        },

        bindModelToDom: function(){
            for( x in this.model.attributes )
                this.model.on(x, this.updateModelToDom);
        },

        bindDomToModel: function(){
            for( var key in this.model.attributes ){
                var el = this.element.querySelector('[name="' + key + '"]');
                var that = this;
                if(el)
                    el.onchange = function(event){
                        that.model.set(this.name, this.value);
                    }
            }
        },

        updateModelToDom: function(key){
            var el = this.element.querySelector('[name="' + key + '"]');

            if(el)
                el.value = this.model.attributes[key];
        },

        updateDomToModel: function(){
            
        }
    })

    var Model = function(attrs){
        this.init(attrs);
    }

    _(Model.prototype).extend({
        attributes: {},
        callbacks: {},

        init: function(attrs){
            if(!attrs || attrs.length < 1) throw("You didn't pass any attributes for this model");
            _(this.attributes).extend(attrs);
            for( var x in this.attributes )
                this.callbacks[x] = [];
        },

        set: function(key, val){
            if(!key || !val) throw("key or val undefined");
            this.attributes[key] = val;
            this.trigger(key);
        },

        get: function(key){
            return this.attributes[key];
        },

        on: function(key, func){
            if(!this.callbacks[key]) return;
            this.callbacks[key].push(func);
        },
        trigger: function(key){
            // Cancel method if there are no event callbacks for this attribute
            if(!this.callbacks[key] || this.callbacks[key].length < 1) return ;
            for (var i = 0; i < this.callbacks[key].length; i++)
                this.callbacks[key][i](key);
        }
    });

    window.m = new Model({ name: 'julian', sirname: 'krispel' });

    window.b = new DomBinder({ element: document.querySelector('form'), model: window.m });
})();
