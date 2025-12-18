/**
 * Basic store tests to verify Redux Toolkit setup
 */
import { store } from '../store';
import {
  setAutoSelection,
  setMotoSelection,
  setMultirisqueSelection,
  clearProductSelection,
  toggleAutoIAC,
  setIACAddOn,
  selectTotalPrice,
  selectHasProductSelection,
  selectAutoSelection,
  selectMotoSelection,
  selectIACAddOn,
  updateEnrollmentForm,
  setPaymentAmount,
  selectEnrollmentForm,
  selectPaymentForm,
} from '../index';
import { ProductType } from '@cnarsugu/types';

describe('Redux Store', () => {
  beforeEach(() => {
    // Reset store state before each test
    store.dispatch(clearProductSelection());
  });

  describe('Store Configuration', () => {
    it('should have the correct initial state', () => {
      const state = store.getState();
      
      expect(state.productSelection).toBeDefined();
      expect(state.enrollment).toBeDefined();
      expect(state.payment).toBeDefined();
      expect(state.api).toBeDefined();
    });
  });

  describe('Product Selection', () => {
    it('should set Auto product selection', () => {
      store.dispatch(
        setAutoSelection({
          cvRange: { min: 2, max: 4, label: '2-4 CV' },
          formula: 'TIERS',
          price: 50000,
          coverages: ['RC', 'DEFENSE'],
        })
      );

      const state = store.getState();
      expect(state.productSelection.autoSelection).toBeDefined();
      expect(state.productSelection.autoSelection?.formula).toBe('TIERS');
      expect(state.productSelection.autoSelection?.price).toBe(50000);
    });

    it('should set Moto product selection', () => {
      store.dispatch(
        setMotoSelection({
          category: 'DJAKARTA',
          formula: 'TIERS',
          price: 30000,
          coverages: ['RC'],
          includesIac: false,
        })
      );

      const state = store.getState();
      expect(state.productSelection.motoSelection).toBeDefined();
      expect(state.productSelection.motoSelection?.category).toBe('DJAKARTA');
      expect(state.productSelection.motoSelection?.price).toBe(30000);
    });

    it('should set Multirisk Pro product selection', () => {
      store.dispatch(
        setMultirisqueSelection({
          packageCode: 'BOUTIQUE_PACK',
          name: 'Boutique Package',
          businessType: 'BOUTIQUE',
          price: 100000,
          coverageDetails: { chapters: [] },
        })
      );

      const state = store.getState();
      expect(state.productSelection.multirisqueSelection).toBeDefined();
      expect(state.productSelection.multirisqueSelection?.packageCode).toBe('BOUTIQUE_PACK');
      expect(state.productSelection.multirisqueSelection?.price).toBe(100000);
    });

    it('should clear all product selections', () => {
      // Set a selection first
      store.dispatch(
        setAutoSelection({
          cvRange: { min: 2, max: 4, label: '2-4 CV' },
          formula: 'TIERS',
          price: 50000,
          coverages: ['RC'],
        })
      );

      // Clear it
      store.dispatch(clearProductSelection());

      const state = store.getState();
      expect(state.productSelection.autoSelection).toBeNull();
      expect(state.productSelection.motoSelection).toBeNull();
      expect(state.productSelection.multirisqueSelection).toBeNull();
    });
  });

  describe('Selectors', () => {
    it('should calculate total price correctly', () => {
      store.dispatch(
        setAutoSelection({
          cvRange: { min: 2, max: 4, label: '2-4 CV' },
          formula: 'TIERS',
          price: 50000,
          coverages: ['RC'],
        })
      );

      const state = store.getState();
      const totalPrice = selectTotalPrice(state);
      expect(totalPrice).toBe(50000);
    });

    it('should detect when product is selected', () => {
      let state = store.getState();
      expect(selectHasProductSelection(state)).toBe(false);

      store.dispatch(
        setAutoSelection({
          cvRange: { min: 2, max: 4, label: '2-4 CV' },
          formula: 'TIERS',
          price: 50000,
          coverages: ['RC'],
        })
      );

      state = store.getState();
      expect(selectHasProductSelection(state)).toBe(true);
    });

    it('should calculate total price with IAC add-on', () => {
      store.dispatch(
        setAutoSelection({
          cvRange: { min: 2, max: 4, label: '2-4 CV' },
          formula: 'TIERS',
          price: 50000,
          coverages: ['RC'],
        })
      );

      store.dispatch(
        setIACAddOn({
          selected: true,
          price: 5000,
          deathCapital: 1000000,
          disabilityCapital: 500000,
          treatmentCapital: 100000,
        })
      );

      const state = store.getState();
      const totalPrice = selectTotalPrice(state);
      expect(totalPrice).toBe(55000);
    });
  });

  describe('IAC Add-on', () => {
    it('should toggle Auto IAC add-on', () => {
      store.dispatch(
        setAutoSelection({
          cvRange: { min: 2, max: 4, label: '2-4 CV' },
          formula: 'TIERS',
          price: 50000,
          coverages: ['RC'],
          addIac: false,
        })
      );

      store.dispatch(toggleAutoIAC(true));

      const state = store.getState();
      expect(state.productSelection.autoSelection?.addIac).toBe(true);
    });

    it('should set IAC add-on details', () => {
      store.dispatch(
        setIACAddOn({
          selected: true,
          price: 5000,
          deathCapital: 1000000,
          disabilityCapital: 500000,
          treatmentCapital: 100000,
        })
      );

      const state = store.getState();
      const iacAddOn = selectIACAddOn(state);
      expect(iacAddOn).toBeDefined();
      expect(iacAddOn?.selected).toBe(true);
      expect(iacAddOn?.price).toBe(5000);
    });
  });

  describe('Integration with Enrollment', () => {
    it('should work with enrollment form data', () => {
      // Set product selection
      store.dispatch(
        setAutoSelection({
          cvRange: { min: 2, max: 4, label: '2-4 CV' },
          formula: 'TIERS',
          price: 50000,
          coverages: ['RC'],
        })
      );

      // Update enrollment form with product details
      store.dispatch(
        updateEnrollmentForm({
          name: 'John',
          surname: 'Doe',
          phoneNumber: '1234567890',
          productType: ProductType.AUTO,
          productDetails: {
            cvRange: { min: 2, max: 4, label: '2-4 CV' },
            formula: 'TIERS',
          },
        })
      );

      const state = store.getState();
      const enrollmentForm = selectEnrollmentForm(state);
      const autoSelection = selectAutoSelection(state);

      expect(enrollmentForm.productType).toBe(ProductType.AUTO);
      expect(enrollmentForm.productDetails?.formula).toBe('TIERS');
      expect(autoSelection?.formula).toBe('TIERS');
    });
  });

  describe('Integration with Payment', () => {
    it('should sync payment amount with product selection', () => {
      // Set product selection
      store.dispatch(
        setMotoSelection({
          category: 'DJAKARTA',
          formula: 'TIERS',
          price: 30000,
          coverages: ['RC'],
          includesIac: false,
        })
      );

      // Set payment amount
      const state = store.getState();
      const totalPrice = selectTotalPrice(state);
      store.dispatch(setPaymentAmount(totalPrice.toString()));

      const paymentForm = selectPaymentForm(store.getState());
      expect(paymentForm.amount).toBe('30000');
    });

    it('should update payment amount when IAC is added', () => {
      // Set product selection
      store.dispatch(
        setAutoSelection({
          cvRange: { min: 2, max: 4, label: '2-4 CV' },
          formula: 'TIERS',
          price: 50000,
          coverages: ['RC'],
        })
      );

      // Add IAC
      store.dispatch(
        setIACAddOn({
          selected: true,
          price: 5000,
          deathCapital: 1000000,
          disabilityCapital: 500000,
          treatmentCapital: 100000,
        })
      );

      const state = store.getState();
      const totalPrice = selectTotalPrice(state);
      expect(totalPrice).toBe(55000);
    });
  });

  describe('Product Type Switching', () => {
    it('should handle switching between product types', () => {
      // Set Auto selection
      store.dispatch(
        setAutoSelection({
          cvRange: { min: 2, max: 4, label: '2-4 CV' },
          formula: 'TIERS',
          price: 50000,
          coverages: ['RC'],
        })
      );

      let state = store.getState();
      expect(state.productSelection.selectedProductType).toBe(ProductType.AUTO);
      expect(selectAutoSelection(state)).toBeDefined();

      // Switch to Moto
      store.dispatch(
        setMotoSelection({
          category: 'DJAKARTA',
          formula: 'TIERS',
          price: 30000,
          coverages: ['RC'],
          includesIac: false,
        })
      );

      state = store.getState();
      expect(state.productSelection.selectedProductType).toBe(ProductType.MOTO);
      expect(selectMotoSelection(state)).toBeDefined();
      // Auto selection should still exist
      expect(selectAutoSelection(state)).toBeDefined();
    });
  });
});
