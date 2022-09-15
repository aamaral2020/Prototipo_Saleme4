odoo.define('pos_proxy_service.models', function (require) {
"use strict";


var field_utils = require('web.field_utils');
var rpc = require('web.rpc');
var session = require('web.session');
var time = require('web.time');
var utils = require('web.utils');
var { Gui } = require('point_of_sale.Gui');
var ErrorPopup = require('point_of_sale.ErrorPopup');
var Registries = require('point_of_sale.Registries');

var models = require('point_of_sale.models');


var posmodel_super = models.PosModel.prototype;
try {
    models.load_fields("res.partner", "l10n_ar_afip_responsibility_type_id");
    models.load_fields("res.partner", "vat");
    models.load_fields("res.partner", "l10n_latam_identification_type_id");
    models.load_fields("pos.payment.method", "payment_afip");
    models.load_fields("res.company", "l10n_ar_afip_responsibility_type_id");
} catch (error) {
  console.error('error al load_fields afip');
  
}



var round_di = utils.round_decimals;
var round_pr = utils.round_precision;

models.PosModel = models.PosModel.extend({
    after_load_server_data: function(){
        var self = this;
        if (this.config.use_fiscal_printer)    
            this.state_printer();
       return posmodel_super.after_load_server_data.call(this);      
     },

    state_printer: function(){
        
        var def  = new $.Deferred();
        var self = this;
        var url = this.config.proxy_fiscal_printer + '/state_printer';
    
    
        var print_fiscal_proxy = $.ajax({
            type: "GET",             
            url: url,
           
            timeout:100000
        });

        print_fiscal_proxy.done(function(res){              
          console.info('state_printer res new: ', res);    
          def.resolve(res);      
          self.message_error_printer_fiscal(res['response'])
          
         
        }).fail(function(xhr, textStatus, errorThrown){  
          self.message_error_printer_fiscal('Comunicación fallida con el Proxy')
          def.reject();
        }); 
        return def;

    },


    print_pos_fiscal_close: function(type){
        
        var def  = new $.Deferred();
        var self = this;
        var url = this.config.proxy_fiscal_printer + '/print_pos_fiscal_close';
        console.info('print_pos_fiscal_close url: ', url);
        var data =  {'type' : type};
        var print_fiscal_proxy = $.ajax({
            type: "GET",             
            url: url,
            data : data,
            timeout:100000
        });

        print_fiscal_proxy.done(function(res){              
          console.info('print_pos_fiscal_close res: ', res);    
          def.resolve(res);      
          self.message_error_printer_fiscal(res['response'])
          
         
        }).fail(function(xhr, textStatus, errorThrown){  
          self.message_error_printer_fiscal('Comunicación fallida con el Proxy')
          def.reject();
        }); 
        return def;

    },


    print_pos_ticket: function(){
    	
    	var def  = new $.Deferred();
        var self = this;
        var url = this.config.proxy_fiscal_printer + '/print_pos_ticket';
        console.info('print_pos_ticket url: ', url);
        var data =  {'vals' : JSON.stringify(self.get_values_ticket())};
        var print_fiscal_proxy = $.ajax({
            type: "GET",             
            url: url,
            data : data,
            timeout:100000
        });

        print_fiscal_proxy.done(function(res){              
          console.info('print_pos_ticket res new: ', res);    
          def.resolve(res);      
          self.message_error_printer_fiscal(res['response'])
          
         
        }).fail(function(xhr, textStatus, errorThrown){  
          self.message_error_printer_fiscal('Comunicación fallida con el Proxy')
          def.reject();
      	}); 
      	return def;

    },
    get_values_ticket: function(){
        var order = this.get_order();       
        
        var type = this.get_value_type();
        var name = order.get_name();         
        var cliente = this.get_values_client();
        var order_lines = this.get_order().get_orderlines();
        var items = this.get_values_items();
        var pagos = this.get_values_paymentlines();
        var descuentos = this.get_values_discount();
        //console.info('pagos: ', pagos);
        var jsonTemplate = {
            'name': name,
            'type': type, 
            'cliente' :cliente,
            'items' :items,
            'pagos':pagos,
            'descuentos': descuentos,
            'ajustes': []// {'descripcion' : 'Ajuste 0.2', 'monto' : 0.2, 'tasa_iva' : '', 'codigo_interno' : '', 'codigo_condicion_iva' : ''} ]

        };
        console.info('jsonTemplate: ', jsonTemplate);
        return jsonTemplate;
    },
    get_value_type: function(){
        var client = this.get_client();
        var type = 83;
        if(client){
            var company_type_afip_monotributo = false;
            if (this.company.l10n_ar_afip_responsibility_type_id && this.company.l10n_ar_afip_responsibility_type_id[1] == 'Responsable Monotributo'){
                company_type_afip_monotributo = true;
            }
            if (client.l10n_ar_afip_responsibility_type_id && !company_type_afip_monotributo){
                if(client.l10n_ar_afip_responsibility_type_id[1] == 'IVA Responsable Inscripto') type = 81; //Factura A
                else if(client.l10n_ar_afip_responsibility_type_id[1] == 'Responsable Monotributo') type = 111;//Factura C
                else if(client.l10n_ar_afip_responsibility_type_id[1] == 'Consumidor Final' || client.l10n_ar_afip_responsibility_type_id[1] == 'IVA Sujeto Exento') type = 82;//Factura B
            }
            else if(company_type_afip_monotributo){
                type = 111;
            }
        }
        return type;
    },
    get_values_client: function(){
        var client = this.get_client();
        //console.info('get_values_ticket: ', client);
        if (client){
            var id_responsabilidad_iva = 'E';
            if (client.l10n_ar_afip_responsibility_type_id){
                if(client.l10n_ar_afip_responsibility_type_id[1] == 'IVA Responsable Inscripto') id_responsabilidad_iva = 'I'; 
                else if(client.l10n_ar_afip_responsibility_type_id[1] == 'Responsable Monotributo') id_responsabilidad_iva = 'M';
                else if(client.l10n_ar_afip_responsibility_type_id[1] == 'Consumidor Final') id_responsabilidad_iva = 'F';
                else if(client.l10n_ar_afip_responsibility_type_id[1] == 'IVA Sujeto Exento') id_responsabilidad_iva = 'E';
            }
            /*id_tipo_documento = {
                'D' : 'DNI' , 
                'L' : 'CUIL' , 
                'T' : 'CUIT' , 
                'C' : 'Cédula de Identidad' ,
                'P' : 'Pasaporte' , 
                'V' : 'Libreta Cívica' , 
                'E' : 'Libreta de Enrolamiento '
            } */
            var id_tipo_documento = 'T';
            if (client.l10n_latam_identification_type_id){

                if(client.l10n_latam_identification_type_id[1] == 'CUIT') id_tipo_documento = 'T';
                if(client.l10n_latam_identification_type_id[1] == 'DNI') id_tipo_documento = 'D';
                if(client.l10n_latam_identification_type_id[1] == 'CUIL') id_tipo_documento = 'L';
                if(client.l10n_latam_identification_type_id[1] == 'Pasaporte') id_tipo_documento = 'P';
                //if(client.l10n_latam_identification_type_id[1] == 'PAS') id_tipo_documento = 'P';
            }
            var street = '';
            var city = '';
            var vat = '';
            if (client.street) street = client.street;
            if(client.city) city = client.city;
            if(client.vat) vat = client.vat;
            return {
                'nombre_o_razon_social1' : client.name,
                'nombre_o_razon_social2' : '',
                'domicilio1' : street,
                'domicilio2' : city,
                'domicilio3' : '',
                'id_tipo_documento' : id_tipo_documento,
                'numero_documento' : vat,
                'id_responsabilidad_iva' : id_responsabilidad_iva,
                'documento_asociado1' : '',
                'documento_asociado2' : '',
                'documento_asociado3' : '',
                'cheque_reintegro_turista' : ''
            };
        }
        return {};
    },
    get_values_items: function(){
       var order_lines = this.get_order().get_orderlines();
       var items = [];
       var type = this.get_value_type();
        /*[
                {'description' : 'Lenovo Idpad', 'description_extra1' : 'I7', 'qty' : 1, 'price' : 0.05, 'iva' : 21, 
                'unit_measure' : '7', 'code_intern' : 'pl758'},
                /*{'description' : 'Mouse Optico Logitech', 'description_extra1' : 'Af56', 'qty' : 1, 'price' : 0.03, 'iva' : 21, 
                'unit_measure' : '7', 'code_intern' : 'LP'},
                {'description' : 'Audifonos Logitech', 'description_extra1' : 'kk7', 'qty' : 1, 'price' : 0.05, 'iva' : 21, 
                'unit_measure' : '7', 'code_intern' : 'pl758'}*/
            //]
        for (var i = 0; i < order_lines.length; i++) {
            var line = order_lines[i];
            var taxes = line.get_taxes();
            var iva = 0; //Tasa de iva ninguno
            var code_intern = '';
            var unit_measure = 0;//Sin unidad de medida
            
            for (var k = 0; k < taxes.length; k++){
                if (taxes[k]){
                    iva = taxes[k].amount;
                    break;
                }
            }

            var uom = line.get_unit()
            if (uom) unit_measure = parseInt(uom.afip_uom);
            if(line.product.barcode) code_intern = line.product.barcode;
            else if(line.product.default_code) code_intern = line.product.default_code;

            if(code_intern == '') code_intern = '11111';
            
            var price = line.get_unit_price() * (1.0 - (line.get_discount() / 100.0));
            if (this.config.version_printer == 'hasar250'){
                price = line.get_all_prices().priceWithTax;
            }
            else if(this.config.version_printer == 'epsont900fa' && type == 83){
                console.info('is epson and is ticket');
                price = line.get_all_prices().priceWithTax / line.quantity;               
            }
            else if(this.config.version_printer == 'epsont900fa' && type != 83){
                console.info('is epson and is not ticket');
                price = line.get_all_prices().priceWithoutTax / line.quantity;
                
            }

            var product_discount_general = false;
           
            if ('module_pos_discount' in this.config &&  this.config.module_pos_discount){
                console.info('discount_product_id: ', this.config.discount_product_id, ' - line.product: ', line.product);
                if(this.config.discount_product_id &&  this.config.discount_product_id[0] == line.product.id && price < 0){
                    product_discount_general = true;
                }
            }
            
            var item_vals = {
                'description' : line.product.display_name,
                'description_extra1' : '',
                'qty' : line.quantity,
                'price' : price,
                'iva' : iva,
                'unit_measure' : String(unit_measure),
                'code_intern' : code_intern,
                'product_discount_general' : product_discount_general

            };
            items.push(item_vals);
        }
        return items;
    },
    get_values_paymentlines: function(){
        var paymentlines = this.get_order().get_paymentlines();
        console.info('get_values_paymentlines: ', paymentlines);
        var pagos = [];
         /*[      
                {'codigo_forma_pago' : 20,
                'cantidad_cuotas' : 3, 'monto' : 0.02345, 'descripcion_cupones' : 'Cupones', 'descripcion' : 'Descripcion test', 'descripcion_extra1' : 'des1', 'descripcion_extra2' : 'des2'}
            ]*/
        for (var i = 0; i < paymentlines.length; i++){
            var pay = paymentlines[i];
            var payment_afip = 99;//Otras Formas de pago

            if (pay.payment_method && pay.payment_method.payment_afip) payment_afip = pay.payment_method.payment_afip;
            var payment_method = pay.payment_method;
            name = '';
            if(payment_method){
                name = payment_method.name;
            }

            var pay_vals = {
                'codigo_forma_pago' : payment_afip,
                'cantidad_cuotas': '',
                'monto' : pay.amount,
                'descripcion_cupones' : '',
                'descripcion' : name,
                'descripcion_extra1' : '',
                'descripcion_extra2' : ''
            }
            pagos.push(pay_vals);
        }
        return pagos;

    },
    get_values_discount: function(){
        var order_lines = this.get_order().get_orderlines();
        var rounding = this.currency.rounding;
        var sum_amount_discount = 0;

        for (var i = 0; i < order_lines.length; i++){
            var line = order_lines[i];
            var base_price = line.get_base_price()
            var price_line_bruto = round_pr(line.get_unit_price() * line.get_quantity(), rounding);
            var discount = price_line_bruto - base_price;
            //console.info('discount: ', discount);
            sum_amount_discount += discount;
        }
        if (sum_amount_discount == 0) return [];
        var vals = [      
            {'descripcion' : 'Descuentos', 'monto' : sum_amount_discount, 'tasa_iva' : '', 'codigo_interno' : '', 'codigo_condicion_iva' : ''}
        ];
        return vals;
    },
    message_error_printer_fiscal: function(error){
        var self= this;
        if (error != true){
            Gui.showPopup('ErrorPopup',{
                'title': 'Error Impresora Fiscal',
                'body':  error,
            });
        }
    }
    
});



});

