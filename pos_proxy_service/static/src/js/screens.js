odoo.define('pos_proxy_service.screens', function(require) {
    'use strict';

    const PaymentScreen = require('point_of_sale.PaymentScreen');
    const Registries = require('point_of_sale.Registries');

    const POSValidateOverride = PaymentScreen =>
        class extends PaymentScreen {
            /**
             * @override
             */

            async _finalizeValidation() {
                
                if (this.env.pos.config.use_fiscal_printer){
                
                var response = this.env.pos.print_pos_ticket();
               

                }

                await super._finalizeValidation();

            }
        };

    Registries.Component.extend(PaymentScreen, POSValidateOverride);

    return PaymentScreen;
});
