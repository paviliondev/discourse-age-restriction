import { withPluginApi } from 'discourse/lib/plugin-api';
import InputValidation from "discourse/models/input-validation";

export default {
  name: 'age-restriction-initializer',
  initialize(container) {
    const siteSettings = container.lookup("site-settings:main");

    withPluginApi('0.8.13', api => {
      api.modifyClass('component:create-account', {
        hideName: function() {
          if (siteSettings.enable_names) {
            const $nameInput = this.$('#new-account-name').parents('tr.input');
            const $nameInstructions = $nameInput.next('tr.instructions');
            $nameInput.hide();
            $nameInstructions.hide();
          }
        }.on('didInsertElement')
      });

      api.modifyClass('controller:create-account', {
        dateOfBirth: null,

        submitDisabled: function() {
          return this._super() || (!this.get('dateOfBirth') || !this.get('ageValidation.ok'));
        }.property(
          "passwordRequired",
          "nameValidation.failed",
          "emailValidation.failed",
          "usernameValidation.failed",
          "passwordValidation.failed",
          "userFieldsValidation.failed",
          "formSubmitted",
          "ageValidation.ok"
        ),

        setAgeValidation: function() {
          const dateOfBirth = this.get('dateOfBirth');
          if (dateOfBirth) {
            const age = Math.abs(dateOfBirth.diff(moment(), 'years'));
            let ageValidation;

            if (age >= 13) {
              ageValidation = InputValidation.create({
                ok: true
              });
            } else {
              ageValidation = InputValidation.create({
                failed: true,
                reason: I18n.t("user.age.invalid")
              });
            }

            this.set('ageValidation', ageValidation);
          }
        }.observes('dateOfBirth')
      });
    });
  }
}
