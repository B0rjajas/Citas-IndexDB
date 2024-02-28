(function(){

    let DB;
    const listadoClientes = document.querySelector('#listado-clientes');

    
    document.addEventListener('DOMContentLoaded', () =>{
        crearDB();

        if(window.indexedDB.open('crm', 1)){
            obtenerClientes();
        }

        listadoClientes.addEventListener('click', eliminarRegistro);
    });

    function eliminarRegistro(){
        if(e.target.classlits.contains('eliminar')){
            console.log('Diste click en eliminar');
            const idEliminar = Number(e.target.dataset.cliente);
            console.log(idEliminar);

            const confirmar = confirm('Deseas eliminar este cliente');//Muestra un navegador NATIVO
            console.log(confirmar);
        };
    }

    // Crear la base de datos IndexDB
    function crearDB(){
        const crearDB = window.indexedDB.open('crm', 1);

        crearDB.onerror = function(){
            console.log('Hubo un error');
        };

        crearDB.onsuccess = function(){
            DB = crearDB.result;
        };

        // Crear la tabla
        crearDB.onupgradeneeded = function(e) {
            const db = e.target.result;
            const objectStore = db.createObjectStore('crm', { keyPath: 'id', autoIncrement: true });

            objectStore.createIndex('nombre', 'nombre', { unique: false });
            objectStore.createIndex('email', 'email', { unique: true });
            objectStore.createIndex('telefono', 'telefono', { unique: false });
            objectStore.createIndex('empresa', 'empresa', { unique: false });
            objectStore.createIndex('id', 'id', { unique: true });

            console.log('Creado con éxito');
        };
    }

    function obtenerClientes(){
        const abrirConexion = window.indexedDB.open('crm', 1);

        abrirConexion.onerror = function() {
            console.log('hubo un error');
        };

        abrirConexion.onsuccess = function(){
            DB = abrirConexion.result;

            const objectStore = DB.transaction('crm').objectStore('crm');

            objectStore.openCursor().onsuccess = function(event) {
                const cursor = event.target.result;

                if(cursor){
                    const {nombre, empresa, telefono, email, id } = cursor.value;
                    listadoClientes.innerHTML +=  `<tr>
                        <td class="px-6 py-4 whitespace-no-wrap border-bottom border-gray-200">
                            <p class="text-lg font-bold text-gray-700 mb-2">${nombre}</p>
                            <p class="text-gray-700">${email}</p>
                        </td>
                        <td class="px-6 py-4 whitespace-no-wrap border-bottom border-gray-200">
                            <p class="text-gray-700">${telefono}</p>
                        </td>
                        <td class="px-6 py-4 whitespace-no-wrap border-bottom border-gray-200 text-gray-600">
                            <p class="text-gray-600">${empresa}</p>
                        </td>
                        <td class="px-6 py-4 whitespace-no-wrap border-bottom border-gray-200 text-sm">
                            <a href="editar-cliente.html?id=${id}" class="text-teal-600 hover:text-teal-900 me-3">Editar</a>
                            <a href="#" data-cliente="${id}" class="text-red-600 hover:text-red-900 eliminar">Eliminar</a>
                        </td>
                    </tr>
                    `;

                    cursor.continue();
                    
                } else {
                    console.log('No hay más registros...');
                }
            }
        }
    }
})();
