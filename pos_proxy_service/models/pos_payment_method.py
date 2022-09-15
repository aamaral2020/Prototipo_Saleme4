from odoo import api, fields, models, _
from odoo.exceptions import UserError

class PosPaymentMethod(models.Model): 

	_inherit = "pos.payment.method"
	payment_afip = fields.Selection([
		('1','CARTA_DE_CREDITO_DOCUMENTARIO'),
		('2','CARTAS_DE_CREDITO_SIMPLE'),
		('3','CHEQUE'),
		('4','CHEQUES_CANCELATORIOS'),
		('5','CREDITO_DOCUMENTARIO'),
		('6','CUENTA_CORRIENTE'),
		('7','DEPOSITO'),
		('8','EFECTIVO'),
		('9','ENDOSO_DE_CHEQUE'),
		('10','FACTURA_DE_CREDITO'),
		('11','GARANTIAS_BANCARIAS'),
		('12','GIROS'),
		('13','LETRAS_DE_CAMBIO'),
		('14','MEDIOS_DE_PAGO_DE_COMERCIO_EXTERIOR'),
		('15','ORDEN_DE_PAGO_DOCUMENTARIA'),
		('16','ORDEN_DE_PAGO_SIMPLE'),
		('17','PAGO_CONTRA_REEMBOLSO'),
		('18','REMESA_DOCUMENTARIA'),
		('19','REMESA_SIMPLE'),
		('20','TARJETA_DE_CREDITO'),
		('21','TARJETA_DE_DEBITO'),
		('22','TICKET'),
		('23','TRANSFERENCIA_BANCARIA'),
		('24','TRANSFERENCIA_NO_BANCARIA'),
		('99','OTROS_MEDIOS_DE_PAGO')
		], 'Forma de Pago AFIP',
		default='99')