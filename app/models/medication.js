import AbstractModel from 'megd/models/abstract';
import CanEditRequested from 'megd/mixins/can-edit-requested';
import DS from 'ember-data';
import DateFormat from 'megd/mixins/date-format';
import Ember from 'ember';
import MedicationDetails from 'megd/mixins/medication-details';

export default AbstractModel.extend(CanEditRequested, DateFormat, MedicationDetails, {
  inventoryItem: DS.belongsTo('inventory', {
    async: true
  }),
  notes: DS.attr('string'),
  patient: DS.belongsTo('patient', {
    async: false
  }),
  prescription: DS.attr('string'),
  prescriptionDate: DS.attr('date'),
  quantity: DS.attr('number'),
  refills: DS.attr('number'),
  requestedDate: DS.attr('date'),
  requestedBy: DS.attr('string'),
  status: DS.attr('string'),
  visit: DS.belongsTo('visit', {
    async: false
  }),

  isRequested: function() {
    var status = this.get('status');
    return (status === 'Requested');
  }.property('status'),

  medicationName: function() {
    return this.getMedicationName('inventoryItem');
  }.property('medicationTitle', 'inventoryItem'),

  medicationPrice: function() {
    return this.getMedicationPrice('inventoryItem');
  }.property('priceOfMedication', 'inventoryItem'),

  prescriptionDateAsTime: function() {
    return this.dateToTime(this.get('prescriptionDate'));
  }.property('prescriptionDate'),

  requestedDateAsTime: function() {
    return this.dateToTime(this.get('requestedDate'));
  }.property('requestedDate'),

  validations: {
    prescription: {
      acceptance: {
        accept: true,
        if: function(object) {
          if (!object.get('hasDirtyAttributes') || object.get('isFulfilling')) {
            return false;
          }
          var prescription = object.get('prescription'),
            quantity = object.get('quantity');
          if (Ember.isEmpty(prescription) && Ember.isEmpty(quantity)) {
            // force validation to fail
            return true;
          } else {
            return false;
          }
        },
        message: 'Please enter a prescription or a quantity'
      }
    },

    inventoryItemTypeAhead: {
      acceptance: {
        accept: true,
        if: function(object) {
          if (!object.get('hasDirtyAttributes') || !object.get('isNew')) {
            return false;
          }
          var itemName = object.get('inventoryItem.name'),
            itemTypeAhead = object.get('inventoryItemTypeAhead');
          if (Ember.isEmpty(itemName) || Ember.isEmpty(itemTypeAhead)) {
            // force validation to fail
            return true;
          } else {
            var typeAheadName = itemTypeAhead.substr(0, itemName.length);
            if (itemName !== typeAheadName) {
              return true;
            }
          }
          // Inventory item is properly selected; don't do any further validation
          return false;
        },
        message: 'Please select a valid medication'
      }
    },

    patientTypeAhead: {
      presence: {
        if: function(object) {
          return (object.get('selectPatient'));
        }
      }
    },

    quantity: {
      numericality: {
        allowBlank: true,
        greaterThan: 0,
        messages: {
          greaterThan: 'must be greater than 0'
        }
      },
      presence: {
        if: function(object) {
          var isFulfilling = object.get('isFulfilling');
          return isFulfilling;
        }
      },
      acceptance: {
        accept: true,
        if: function(object) {
          var isFulfilling = object.get('isFulfilling'),
            requestQuantity = parseInt(object.get('quantity')),
            quantityToCompare = null;
          if (!isFulfilling) {
            // no validation needed when not fulfilling
            return false;
          } else {
            quantityToCompare = object.get('inventoryItem.quantity');
          }
          if (requestQuantity > quantityToCompare) {
            // force validation to fail
            return true;
          } else {
            // There is enough quantity on hand.
            return false;
          }
        },
        message: 'The quantity must be less than or equal to the number of available medication.'
      }
    },

    refills: {
      numericality: {
        allowBlank: true
      }
    }
  }
});
