const steps = ['Carrito', 'Envio', 'Pago']

function Stepper({ activeStep }) {
  return (
    <ol className="stepper" aria-label="Progreso del checkout">
      {steps.map((step, index) => (
        <li key={step} className={index <= activeStep ? 'active' : ''}>
          <span>{index + 1}</span>
          {step}
        </li>
      ))}
    </ol>
  )
}

export default Stepper
