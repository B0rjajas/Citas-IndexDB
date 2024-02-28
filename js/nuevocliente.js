(function(){
    let DB;

    const formulario = document.querySelector('#formulario');

    document.addEventListener('DOMContentLoaded', () =>{
        conectarDB();
        formulario.addEventListener('submit', validarCliente);
    });

    

    function validarCliente(e){
        e.preventDefault();

        console.log('Validando cliente');

        const nombre = document.querySelector('#nombre').value;
        const email = document.querySelector('#email').value;
        const empresa = document.querySelector('#empresa').value;
        const telefono = document.querySelector('#telefono').value;

        if(nombre ,email, empresa, telefono === ''){
            imprimirAlerta('Todos los campos son obligatorios', 'error');
            return
        } 

        const cliente = {
            nombre,
            email,
            empresa,
            telefono,
            
        };

        clienteReciente(cliente);
    }
           
    

    function clienteReciente(cliente) {
        console.log('Agregando cliente a la base de datos');
        
        const transaction = DB.transaction(['crm'], 'readwrite');
        const objectStore = transaction.objectStore('crm');
    
        transaction.onerror = function(event) {
            console.log('Error al iniciar la transacción:', event.target.error);
        };
    
        const request = objectStore.add(cliente);
    
        request.onsuccess = function() {
            console.log('Cliente agregado correctamente a la base de datos');
            imprimirAlerta('Cliente agregado correctamente', 'success');
            setTimeout(() =>{
                window.location.href = 'index.html';
            }, 3000);
        };
    
        request.onerror = function(event) {
            console.log('Error al agregar cliente:', event.target.error);
        };
    }
    

    

    
})();
