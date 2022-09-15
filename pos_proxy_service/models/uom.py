from odoo import models, fields, api
from odoo.exceptions import UserError



class ProductUoM(models.Model):
    _inherit = "uom.uom"


    afip_uom = fields.Selection([
	("0", 'SIN_DESCRIPCION'),
	('1','KILOGRAMO'),
	('2','METROS'),
	('3','METRO_CUADRADO'),
	('4','METRO_CUBICO'),
	('5','LITROS'),
	('7','UNIDAD'),
	('8','PAR'),
	('9','DOCENA'),
	('10','QUILATE'),
	('11','MILLAR'),
	('12','MEGA_U_INTER_ACT_ANTIB'),
	('13','UNIDAD_INT_ACT_INMUNG'),
	('14','GRAMO'),
	('15','MILIMETRO'),
	('16','MILIMETRO_CUBICO'),
	('17','KILOMETRO'),
	('18','HECTOLITRO'),
	('19','MEGA_UNIDAD_INT_ACT_INMUNG '),
	('20','CENTIMETRO'),
	('21','KILOGRAMO_ACTIVO'),
	('22','GRAMO_ACTIVO'),
	('23','GRAMO_BASE'),
	('24','UIACTHOR'),
	('25','JGO_PQT_MAZO_NAIPES'),
	('26','MUIACTHOR'),
	('27','CENTIMETRO_CUBICO'),
	('28','UIACTANT'),
	('29','TONELADA'),
	('30','DECAMETRO_CUBICO'),
	('31','HECTOMETRO_CUBICO'),
	('32','KILOMETRO_CUBICO'),
	('33','MICROGRAMO'),
	('34','NANOGRAMO'),
	('35','PICOGRAMO'),
	('36','MUIACTANT'),
	('37','UIACTIG'),
	('41','MILIGRAMO'),
	('47','MILILITRO'),
	('48','CURIE'),
	('49','MILICURIE'),
	('50','MICROCURIE'),
	('51','U_INTER_ACT_HORMONAL'),
	('52','MEGA_U_INTER_ACT_HORMONAL'),
	('53','KILOGRAMO_BASE'),
	('54','GRUESA'),
	('55','MUIACTIG'),
	('61','KILOGRAMO_BRUTO'),
	('62','PACK'),
	('63','HORMA')   
        ],
        'Unidad AFIP', default='0')


