document.addEventListener('DOMContentLoaded', function () {
    const formElement = document.getElementById('contactForm');
    const textArea = document.getElementById('selectedProducts');
    const submitButton = document.querySelector('button[type="submit"]');
    const buttonText = submitButton.querySelector('.button-text');
    const whatsappIcon = submitButton.querySelector('.whatsapp-icon');
    const loadingOverlay = document.getElementById('loadingOverlay');
    const spinner = loadingOverlay.querySelector('.spinner');
    const spinnerIcon = spinner.querySelector('.fa-spinner');
    const checkIcon = spinner.querySelector('.fa-check');

    formElement.addEventListener('submit', function (event) {
        event.preventDefault();

        loadingOverlay.style.display = 'flex';
        textArea.value = generateQuoteText();

        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const tel = document.getElementById('tel').value;
        const selectedProducts = textArea.value;
        const uniqueId = generateUniqueId();

        const title = `${name} | ${email} | ${tel} | ${uniqueId}`;

        // Define o parâmetro de URL de conversão
        const urlConversao = window.location.href;

        const payload = {
            "rules": {
                "update": "false",
                "filter_status_update": "open",
                "equal_pipeline": "true",
                "status": "open",
                "validate_cpf": "false",
            },
            leads: [{
                id: name,
                title: name,
                email: email,
                name: name,
                mobile_phone: tel,
                last_conversion: {
                    source: "SITE_FAST_FORM"
                },
                custom_fields: {
                    url_conversao: urlConversao, // Usa a URL atual como conversão
                    utm_source: "",
                    utm_medium: "",
                    utm_campaign: "",
                    utm_term: "",
                    utm_content: "",
                    utm_position: "",
                    utm_device: "",
                    utm_match: "",
                    utm_creative: ""
                },
                tags: ["inicial"],
                notes: ["formulario direcionado do site."]
            }]
        };

        fetch('https://app.pipe.run/webservice/integradorJson?hash=1e28b707-3c02-4393-bb9d-d3826b060dcd', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        })
        .then(response => response.json())
        .then(data => {
            console.log('Success:', data);

            setTimeout(() => {
                spinner.classList.add('show-check');
                setTimeout(() => {
                    loadingOverlay.style.display = 'none';
                    formElement.innerHTML = '';
                    const messageElement = document.createElement('div');
                    messageElement.style.position = 'fixed';
                    messageElement.style.top = '50%';
                    messageElement.style.left = '50%';
                    messageElement.style.transform = 'translate(-50%, -50%)';
                    messageElement.style.fontSize = '24px';
                    messageElement.style.textAlign = 'center';
                    messageElement.innerHTML = 'Você já enviou!';

                    document.body.appendChild(messageElement);
                }, 500);
            }, 300);
        })
        .catch((error) => {
            console.error('Error:', error);
            alert('Houve um erro ao enviar o formulário.');
        });
    });

    function generateQuoteText() {
        const sidebarProducts = document.querySelectorAll('.sidebar-product');
        let text = "<b>Produtos selecionados:</b><br>";

        sidebarProducts.forEach(product => {
            const productName = product.querySelector('.sidebar-product-details h6').textContent;
            const productThickness = product.querySelector('.sidebar-product-details p').textContent;
            text += `<b>Produto:</b> ${productName}<br><b>Medidas:</b> ${productThickness}<br><br>`;
        });

        return text;
    }

    function generateUniqueId() {
        return new Date().getTime().toString();
    }
});
