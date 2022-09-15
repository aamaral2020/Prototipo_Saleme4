# -*- coding: utf-8 -*-
#    Copyright (C) 2007  pronexo.com  (https://www.pronexo.com)
#    All Rights Reserved.
#
#    This program is free software: you can redistribute it and/or modify
#    it under the terms of the GNU Affero General Public License as
#    published by the Free Software Foundation, either version 3 of the
#    License, or (at your option) any later version.
#
#    This program is distributed in the hope that it will be useful,
#    but WITHOUT ANY WARRANTY; without even the implied warranty of
#    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
#    GNU Affero General Public License for more details.
#
#    You should have received a copy of the GNU Affero General Public License
#    along with this program.  If not, see <http://www.gnu.org/licenses/>.
#
############################################################################## # 
# 
{
	'name': 'Pos Proxy Services',
	'summary': 'Proxy para usar odoo con impresores fiscales Argentinos para Epson / Hasar',
	'description': 'Impresor Fiscal Epson, Impresor Fiscal Hasar Vieja y Nueva generacion',
	'version': '15.0.1.3',
	'author': "Pronexo",
	'license': "AGPL-3",
	'maintainer': 'Pronexo',
	'category': 'Sales/Point of Sale',
        'website': 'https://www.pronexo.com',
	'depends': [
		'point_of_sale'
	],
	'data': [
		#'security/ir.model.access.csv',
		'views/uom_view.xml',
		'views/pos_payment_method_view.xml',
		'views/pos_config_view.xml'
	],
        'assets': {
            'point_of_sale.assets': [
            'pos_proxy_service/static/src/js/models.js',
            'pos_proxy_service/static/src/js/screens.js',
            'pos_proxy_service/static/src/js/cf_button.js',
        ],
        'web.assets_qweb': ['pos_proxy_service/static/src/xml/**/*',],
    },
	'external_dependencies': {
   
    },
	'auto_install': False,
	'installable': True,
	'price': 0,
        'currency': 'USD',
        'images': ['images/pos-proxy-service-home.png'],
        'live_test_url': 'https://www.youtube.com/watch?v=SKFlc8bKZAI'
}
