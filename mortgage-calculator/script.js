// Mortgage Calculator JavaScript
class MortgageCalculator {
    constructor() {
        this.initializeElements();
        this.bindEvents();
        this.setDefaultValues();
    }

    initializeElements() {
        // Input elements
        this.homePriceInput = document.getElementById('homePrice');
        this.downPaymentInput = document.getElementById('downPayment');
        this.loanTermSelect = document.getElementById('loanTerm');
        this.interestRateInput = document.getElementById('interestRate');
        this.propertyTaxInput = document.getElementById('propertyTax');
        this.homeInsuranceInput = document.getElementById('homeInsurance');
        this.pmiInput = document.getElementById('pmi');

        // Percentage buttons
        this.percentageButtons = document.querySelectorAll('.percentage-btn');

        // Result elements
        this.monthlyPaymentEl = document.getElementById('monthlyPayment');
        this.principalInterestEl = document.getElementById('principalInterest');
        this.monthlyTaxEl = document.getElementById('monthlyTax');
        this.monthlyInsuranceEl = document.getElementById('monthlyInsurance');
        this.monthlyPMIEl = document.getElementById('monthlyPMI');
        this.totalInterestEl = document.getElementById('totalInterest');
        this.totalAmountEl = document.getElementById('totalAmount');
        this.loanAmountEl = document.getElementById('loanAmount');

        // Action buttons
        this.calculateBtn = document.getElementById('calculateBtn');
        this.resetBtn = document.getElementById('resetBtn');
    }

    bindEvents() {
        // Input change events for real-time calculation
        const inputs = [
            this.homePriceInput,
            this.downPaymentInput,
            this.loanTermSelect,
            this.interestRateInput,
            this.propertyTaxInput,
            this.homeInsuranceInput,
            this.pmiInput
        ];

        inputs.forEach(input => {
            input.addEventListener('input', () => this.calculateMortgage());
            input.addEventListener('change', () => this.calculateMortgage());
        });

        // Percentage buttons
        this.percentageButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const percentage = parseFloat(e.target.dataset.percentage);
                this.setDownPaymentByPercentage(percentage);
            });
        });

        // Action buttons
        this.calculateBtn.addEventListener('click', () => this.calculateMortgage());
        this.resetBtn.addEventListener('click', () => this.resetCalculator());

        // Format number inputs as user types
        [this.homePriceInput, this.downPaymentInput, this.propertyTaxInput, this.homeInsuranceInput].forEach(input => {
            input.addEventListener('input', (e) => this.formatCurrencyInput(e.target));
        });
    }

    setDefaultValues() {
        // Set some reasonable default values
        this.homePriceInput.value = '500000';
        this.downPaymentInput.value = '100000';
        this.interestRateInput.value = '6.5';
        this.propertyTaxInput.value = '6000';
        this.homeInsuranceInput.value = '1200';
        this.pmiInput.value = '0.5';

        // Calculate with default values
        this.calculateMortgage();
    }

    setDownPaymentByPercentage(percentage) {
        const homePrice = parseFloat(this.homePriceInput.value) || 0;
        const downPayment = (homePrice * percentage) / 100;
        this.downPaymentInput.value = Math.round(downPayment);
        
        // Update active button
        this.percentageButtons.forEach(btn => btn.classList.remove('active'));
        event.target.classList.add('active');
        
        this.calculateMortgage();
    }

    formatCurrencyInput(input) {
        // Remove non-numeric characters
        let value = input.value.replace(/[^0-9]/g, '');
        
        // Convert to number and back to string to remove leading zeros
        if (value) {
            value = parseInt(value).toString();
        }
        
        input.value = value;
    }

    calculateMortgage() {
        try {
            // Get input values
            const homePrice = parseFloat(this.homePriceInput.value) || 0;
            const downPayment = parseFloat(this.downPaymentInput.value) || 0;
            const loanTerm = parseInt(this.loanTermSelect.value) || 30;
            const interestRate = parseFloat(this.interestRateInput.value) || 0;
            const propertyTax = parseFloat(this.propertyTaxInput.value) || 0;
            const homeInsurance = parseFloat(this.homeInsuranceInput.value) || 0;
            const pmiRate = parseFloat(this.pmiInput.value) || 0;

            // Validate inputs
            if (homePrice <= 0) {
                this.showError('Please enter a valid home price');
                return;
            }

            if (downPayment >= homePrice) {
                this.showError('Down payment must be less than home price');
                return;
            }

            if (interestRate <= 0) {
                this.showError('Please enter a valid interest rate');
                return;
            }

            // Calculate loan amount
            const loanAmount = homePrice - downPayment;

            // Calculate monthly interest rate
            const monthlyInterestRate = interestRate / 100 / 12;

            // Calculate number of payments
            const numberOfPayments = loanTerm * 12;

            // Calculate principal and interest payment
            let principalInterest = 0;
            if (monthlyInterestRate > 0) {
                principalInterest = loanAmount * 
                    (monthlyInterestRate * Math.pow(1 + monthlyInterestRate, numberOfPayments)) /
                    (Math.pow(1 + monthlyInterestRate, numberOfPayments) - 1);
            } else {
                principalInterest = loanAmount / numberOfPayments;
            }

            // Calculate monthly property tax
            const monthlyTax = propertyTax / 12;

            // Calculate monthly insurance
            const monthlyInsurance = homeInsurance / 12;

            // Calculate monthly PMI (only if down payment is less than 20%)
            const downPaymentPercentage = (downPayment / homePrice) * 100;
            const monthlyPMI = downPaymentPercentage < 20 ? 
                (loanAmount * pmiRate / 100) / 12 : 0;

            // Calculate total monthly payment
            const monthlyPayment = principalInterest + monthlyTax + monthlyInsurance + monthlyPMI;

            // Calculate total interest paid over loan term
            const totalInterest = (principalInterest * numberOfPayments) - loanAmount;

            // Calculate total amount paid
            const totalAmount = monthlyPayment * numberOfPayments;

            // Update UI
            this.updateResults({
                monthlyPayment,
                principalInterest,
                monthlyTax,
                monthlyInsurance,
                monthlyPMI,
                totalInterest,
                totalAmount,
                loanAmount
            });

            // Clear any previous errors
            this.clearError();

        } catch (error) {
            console.error('Calculation error:', error);
            this.showError('An error occurred during calculation');
        }
    }

    updateResults(results) {
        // Add loading animation
        this.calculateBtn.classList.add('calculating');
        
        // Update all result elements with animation
        setTimeout(() => {
            this.monthlyPaymentEl.textContent = this.formatCurrency(results.monthlyPayment);
            this.principalInterestEl.textContent = this.formatCurrency(results.principalInterest);
            this.monthlyTaxEl.textContent = this.formatCurrency(results.monthlyTax);
            this.monthlyInsuranceEl.textContent = this.formatCurrency(results.monthlyInsurance);
            this.monthlyPMIEl.textContent = this.formatCurrency(results.monthlyPMI);
            this.totalInterestEl.textContent = this.formatCurrency(results.totalInterest);
            this.totalAmountEl.textContent = this.formatCurrency(results.totalAmount);
            this.loanAmountEl.textContent = this.formatCurrency(results.loanAmount);

            // Add pulse animation to result amounts
            const resultAmounts = document.querySelectorAll('.result-amount');
            resultAmounts.forEach(el => {
                el.classList.add('updated');
                setTimeout(() => el.classList.remove('updated'), 600);
            });

            // Remove loading animation
            this.calculateBtn.classList.remove('calculating');
        }, 100);
    }

    formatCurrency(amount) {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(amount);
    }

    showError(message) {
        // Remove existing error messages
        this.clearError();

        // Create error message element
        const errorEl = document.createElement('div');
        errorEl.className = 'error-message';
        errorEl.textContent = message;
        errorEl.style.cssText = `
            background: #ff4444;
            color: white;
            padding: 12px 16px;
            border-radius: 8px;
            margin: 16px 0;
            font-weight: 600;
            text-align: center;
            animation: slideDown 0.3s ease-out;
        `;

        // Insert error message after the header
        const header = document.querySelector('.header');
        header.insertAdjacentElement('afterend', errorEl);

        // Auto-remove after 5 seconds
        setTimeout(() => {
            if (errorEl.parentNode) {
                errorEl.remove();
            }
        }, 5000);
    }

    clearError() {
        const existingError = document.querySelector('.error-message');
        if (existingError) {
            existingError.remove();
        }
    }

    resetCalculator() {
        // Reset all inputs
        this.homePriceInput.value = '';
        this.downPaymentInput.value = '';
        this.interestRateInput.value = '';
        this.propertyTaxInput.value = '';
        this.homeInsuranceInput.value = '';
        this.pmiInput.value = '';
        this.loanTermSelect.value = '30';

        // Reset percentage buttons
        this.percentageButtons.forEach(btn => btn.classList.remove('active'));

        // Reset results
        const resultElements = [
            this.monthlyPaymentEl,
            this.principalInterestEl,
            this.monthlyTaxEl,
            this.monthlyInsuranceEl,
            this.monthlyPMIEl,
            this.totalInterestEl,
            this.totalAmountEl,
            this.loanAmountEl
        ];

        resultElements.forEach(el => {
            el.textContent = '$0';
        });

        // Clear any errors
        this.clearError();

        // Focus on home price input
        this.homePriceInput.focus();
    }
}

// Add CSS for error message animation
const style = document.createElement('style');
style.textContent = `
    @keyframes slideDown {
        from {
            opacity: 0;
            transform: translateY(-10px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
`;
document.head.appendChild(style);

// Initialize calculator when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new MortgageCalculator();
});

// Add touch-friendly interactions for mobile
document.addEventListener('DOMContentLoaded', () => {
    // Add touch feedback for buttons
    const buttons = document.querySelectorAll('button');
    buttons.forEach(button => {
        button.addEventListener('touchstart', function() {
            this.style.transform = 'scale(0.95)';
        });
        
        button.addEventListener('touchend', function() {
            this.style.transform = 'scale(1)';
        });
    });

    // Prevent zoom on input focus for iOS
    const inputs = document.querySelectorAll('input[type="number"]');
    inputs.forEach(input => {
        input.addEventListener('focus', function() {
            if (window.innerWidth < 768) {
                this.style.fontSize = '16px';
            }
        });
    });
});
