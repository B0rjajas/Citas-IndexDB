(function() {
    let DB;
    let idCliente;

    const nombreInput = document.querySelector('#nombre');
    const emailInput = document.querySelector('#email');
    const telefonoInput = document.querySelector('#telefono');
    const empresaInput = document.querySelector('#empresa');
    const formulario = document.querySelector('#formulario');

    document.addEventListener('DOMContentLoaded', () => {
        conectarDB();

        formulario.addEventListener('submit', actualizarCliente);

        const parametrosURL = new URLSearchParams(window.location.search);
        const idCliente = parametrosURL.get('id');
        if (idCliente) {

            setTimeout( ()=> {
                obtenerCliente(idCliente);
            },1000);
            

        }
    });

    function actualizarCliente(e) {
        e.preventDefault();

        const nuevoNombre = nombreInput.value.trim();
        const nuevoEmail = emailInput.value.trim();
        const nuevoTelefono = telefonoInput.value.trim();
        const nuevaEmpresa = empresaInput.value.trim();

        if (!nuevoNombre || !nuevoEmail || !nuevoTelefono || !nuevaEmpresa) {
            imprimirAlerta('Todos los campos son obligatorios', 'error');
            return;
        }

        const clienteActualizado = {
            nombre: nuevoNombre,
            email: nuevoEmail,
            telefono: nuevoTelefono,
            empresa: nuevaEmpresa,
            id: Number(idCliente)
        };

        const transaction = DB.transaction(['crm'], 'readwrite');
        const objectStore = transaction.objectStore('crm');

        objectStore.put(clienteActualizado);

        transaction.oncomplete = function() {
            imprimirAlerta('Cliente actualizado correctamente');
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 3000);
        };

        transaction.onerror = function() {
            imprimirAlerta('Hubo un error al actualizar el cliente', 'error');
        };
    }

    function obtenerCliente(id) {
        const transaction = DB.transaction(['crm'], 'readonly');
        const objectStore = transaction.objectStore('crm');
    
        const solicitud = objectStore.get(Number(id));
    
        solicitud.onsuccess = function(e) {
            const cliente = e.target.result;
            if (cliente && cliente.id === Number(id)) {
                llenarFormulario(cliente);
            }
        };
    
        solicitud.onerror = function() {
            imprimirAlerta('No se pudo obtener el cliente', 'error');
        };
    }

    function llenarFormulario(cliente) {
        // Llenar los campos del formulario con los datos del cliente
        // Si el valor del cliente es null o undefined, se establecerá como cadena vacía ''
        nombreInput.value = cliente.nombre || '';
        emailInput.value = cliente.email || '';
        telefonoInput.value = cliente.telefono || '';
        empresaInput.value = cliente.empresa || '';
    }

    function conectarDB() {
        const abrirConexion = window.indexedDB.open('crm', 1);
    
        abrirConexion.onerror = function() {
            console.log('Error al abrir la base de datos');
        };
    
        abrirConexion.onsuccess = function() {
            DB = abrirConexion.result;
            // Llamar a la función para listar clientes después de establecer la conexión
            listarClientes();
        };
    }

    function imprimirAlerta(mensaje, tipo = 'success') {
        // Implementa la lógica para imprimir alertas
    }
    
    function listarClientes() {
        const transaction = DB.transaction(['crm'], 'readonly');
        const objectStore = transaction.objectStore('crm');
    
        // Limpiar el listado de clientes antes de agregar los nuevos
        const listadoClientes = document.querySelector('#listado-clientes');
        listadoClientes.innerHTML = '';
    
        objectStore.openCursor().onsuccess = function(event) {
            const cursor = event.target.result;
    
            if (cursor) {
                const { nombre, email, telefono, empresa, id } = cursor.value;
    
                // Agregar los datos del cliente al listado
                listadoClientes.innerHTML += `
                    <tr data-cliente="${id}">
                        <td>${nombre}</td>
                        <td>${email}</td>
                        <td>${telefono}</td>
                        <td>${empresa}</td>
                        <td>
                            <button class="btn-editar">Editar</button>
                        </td>
                    </tr>
                `;
    
                cursor.continue();
            } else {
                console.log('No hay más registros...');
            }
        };
    }
})();
