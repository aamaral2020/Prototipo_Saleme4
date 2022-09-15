
from odoo import api, fields, tools, models, _
from odoo.exceptions import UserError



class PosConfig(models.Model):
	_inherit = 'pos.config'

	use_fiscal_printer = fields.Boolean('Impresora Fiscal')
	proxy_fiscal_printer = fields.Char('Ip Impresora Fiscal', default='http://127.0.0.1:5005')
	version_printer = fields.Selection([
		('hasar250', 'Hasar 250'),
		('epsont900fa', 'Epson T900FA'),
	], default='epsont900fa')


class ResCompany(models.Model):
	_inherit = 'res.company'

	def read(self, fields=None, load='_classic_read'):
		lang = self._context.get('lang')  or False
		if lang and lang == 'es_CO':
			if 'l10n_ar_afip_responsibility_type_id' in fields:
				fields.remove('l10n_ar_afip_responsibility_type_id')		
		return super(ResCompany, self).read(fields, load=load)

class ResPartner(models.Model):
	_inherit = 'res.partner'

	def read(self, fields=None, load='_classic_read'):
		lang = self._context.get('lang')  or False
		if lang and lang == 'es_CO':		
			if 'l10n_ar_afip_responsibility_type_id' in fields:
				fields.remove('l10n_ar_afip_responsibility_type_id')
			if 'l10n_latam_identification_type_id' in fields:
				fields.remove('l10n_latam_identification_type_id')
		
		return super(ResPartner, self).read(fields, load=load)
				
