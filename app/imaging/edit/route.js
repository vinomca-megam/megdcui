import { translationMacro as t } from 'ember-i18n';
import AbstractEditRoute from 'megd/routes/abstract-edit-route';
import ChargeRoute from 'megd/mixins/charge-route';
import Ember from 'ember';
import PatientListRoute from 'megd/mixins/patient-list-route';
export default AbstractEditRoute.extend(ChargeRoute, PatientListRoute, {
  editTitle: t('imaging.titles.edit_title'),
  modelName: 'imaging',
  newTitle: t('imaging.titles.new_title'),
  pricingCategory: 'Imaging',

  getNewData: function() {
    return Ember.RSVP.resolve({
      selectPatient: true,
      requestDate: moment().startOf('day').toDate()
    });
  }
});
