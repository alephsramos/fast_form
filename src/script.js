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
        // Previne o envio padrão do formulário
        event.preventDefault();

        // Exibe o overlay de carregamento
        loadingOverlay.style.display = 'flex';

        // Preenche o textarea com os dados dos produtos selecionados
        textArea.value = generateQuoteText();

        // Captura os valores dos campos do formulário
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const tel = document.getElementById('tel').value;
        const selectedProducts = textArea.value;

        // Gera um identificador único para cada submissão
        const uniqueId = generateUniqueId();

        const title = `${name} | ${email} | ${tel} | ${uniqueId}`;

        // Monta o payload conforme necessário para o PipeRun
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
                    url_conversao: "https://atacado2.fastdrywall.com.br/", // Substitua pelo URL desejado
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

        // Envia a requisição para o endpoint do PipeRun
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

            // Oculta o spinner e mostra o ícone de check
            setTimeout(() => {
                spinner.classList.add('show-check');
                setTimeout(() => {
                    loadingOverlay.style.display = 'none'; // Oculta o overlay após a animação

                    // Limpa o formulário após o envio
                    formElement.reset();
                    textArea.value = ''; // Limpa o textarea

                    // Altera o botão para o link do WhatsApp com ícone
                    submitButton.classList.add('success-background');
                    buttonText.style.display = 'none'; // Esconde o texto do botão
                    whatsappIcon.style.display = 'inline-block'; // Mostra o ícone do WhatsApp

                    // Muda o texto do h2 para "Já enviado" com ícone de check
                    const heading = document.querySelector('#contactForm .form-right-text h2');
                    heading.innerHTML = 'Enviado com sucesso!';

                    // Redireciona para o WhatsApp
                    window.open('https://wa.link/gmgjxp');
                }, 500); // Tempo para a transição do check
            }, 300); // Tempo da animação do spinner
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

    // Função para gerar um identificador único
    function generateUniqueId() {
        return new Date().getTime().toString();
    }
});
