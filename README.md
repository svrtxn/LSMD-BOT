# 🚑 LSMD-BOT  

Bot de Discord diseñado para la gestión del **Departamento Médico (EMS)** y **Civiles** en servidores de **GTA V Roleplay**.  
Incluye sistema de **tickets**, **gestión de servicios médicos**, **logs** y organización mediante categorías.

---

## 📌 Requisitos previos
- Node.js v18 o superior  
- Discord.js v14  
- Configuración de **intents** y permisos adecuados en el bot

---

## ⚙️ Configuración inicial

### 1. Categorías de tickets
Crea las siguientes **categorías** en tu servidor de Discord y copia sus **IDs**:  
- `PSICOTECNICOS`
- `POSTULACIONES`
- `CONVENIOS`
- `CITAS MEDICAS`
- `ASCENSOS`
- `REPORTES`
- `SOPORTE`

👉 Luego reemplaza los **IDs de las categorías** en los botones del bot (`ticket-ems, y tickets-civiles`) por los de tu servidor.  

---

### 2. Canales para tickets
- Crea un **canal exclusivo para civiles** y ejecuta el comando:  `/ticket-civiles`
Esto generará el embed con los botones de tickets para civiles.

- Crea un **canal exclusivo para EMS** y ejecuta el comando:  `/ticket-ems`
Esto generará el embed con los botones de tickets para médicos.

- Crea un **canal de logs de tickets** (ej: `#logs-tickets`)  
👉 Copia su **ID** y reemplázalo en el **botón de cerrar ticket**.

---

### 3. Panel de servicio
- Envía el comando: `/panel`

en el canal donde quieras que aparezca el **panel para entrar/salir de servicio**.  

- Crea un **canal de logs de servicios** (ej: `#logs-servicios`).  
👉 Copia su **ID** y reemplázalo en la lógica de `entrar-servicio.js` y `salir-servicio.js`.  

- Crea un **canal de servicios activos** (ej: `#servicios-activos`).  
👉 Copia su **ID** y reemplázalo en los botones de servicio.

---

## 📝 Notas importantes
- El bot debe tener permisos para **administrar canales y mensajes**.  
- Reemplaza todos los **IDs de categorías y canales** por los de tu servidor.  
- Existen comandos de **reload (buttons/commands)** para actualizar sin reiniciar el bot.  
- Revisa que los **paneles y embeds** funcionen tras cualquier cambio.

---

## 🚀 Ejemplo de uso
1. Un civil abre un ticket desde el panel creado por`/ticket-civiles` → el bot crea un canal en la categoría correspondiente.  
2. Un EMS abre un ticket desde el panel creado por `/ticket-ems`→ el bot crea un canal en la categoría correspondiente.    
3. Los médicos entran en servicio con `/panel` → el bot registra su ingreso en `#servicios-activos` y envía log en `#logs-servicios`.  
4. Al cerrar un ticket o salir de servicio, el bot envía registros automáticos a los canales de logs.  

---

## 👨‍💻 Autor
Desarrollado por **SVRTXN**  
