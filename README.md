# Watson School Assistant
**Proyecto para IBM Ambassadors   -   Manuel Alejandro Mendoza Domínguez**


Watson School Assistant es un bot que utiliza diferentes herramientas que ofrece la nube de IBM para
facilitarle a los estudiantes ciertas tareas cotidianas.

![alt text](readme_images/WSA_basic.gif)

[Aquí](https://school-smart-assistant.mybluemix.net) se puede acceder al servició.


Watson School Assistant utiliza los siguientes serviciós de la nube de IBM para funcionar correctamente:
1. Watson Assistant
2. Aplicación Node JS alojado con Cloud Foundry
3. Aplicación Node-Red alojado con Cloud Foundry

Watson School Assistant puede responer preguntas como:
* ¿Qué clases me tocan hoy?
* ¿Que clase me toca después?
* ¿Tengo algún pendiente?

También puede realizar acciones como:
* Avisarte a cierta hora de tareas pendientes
* Agregar una tarea o proyecto a tu lista de pendientes
* Decirte en que salón te tocan tus clases

En este [link](https://youtu.be/ezGPoh2OgDs) se puede ver un video sobre como funciona el proyecto.


## Watson Assistant
![alt text](readme_images/WSA_Assistant.gif)

Se utiliza la tecnología de Watson Assistant para poder entender correctamente lo que le esta solicitando 
el usuario al bot.

Para poder hacer esto se ha entrenado un modelo para reaccionar correctamente a diferentes 'intents' y responder 
de manera correcta al usuario siguiendo un 'dialog' con diferentes respuestas.


![alt text](readme_images/WSA_intents.png)


![alt text](readme_images/WSA_dialog.png)


## Servidor Node JS

Se desarrollo un servidor con Node JS para poder brindar el servicio en la WEB (como se puede ver
[aquí](https://school-smart-assistant.mybluemix.net)), así como para almacenar la información del usuario (clases y
 tareas pendientes) y responder con información correcta y actualizada a las solicitudes del usuario.
 
 Este servidor puede responder a diferentes metodos GET y POST para obtener y brindar la información necesaria.
 
 > El codigo de este servidor se encuentra en 'app.js'
 

## Servidor Node-Red

![alt text](readme_images/WSA_nodeRed.gif)

Se utilizo Node-Red (se puede encontrar en el siguiente [link](https://watson-assistant-school-iot.mybluemix.net/)) para poder hacer la conexión del bot con Telegram y permitirle
a los usuarios utilizar a Watson School Assistant desde su celular de una manera más 
cómoda y sencilla.

Al hacer la conexión con Telegram también se pueden enviar notificaciones al usuario, 
actualmente se utilizan para mandarle un mensaje a las '7:40 am' con los pendientes
que tiene.

> El bot se puede encontrar en telegram como watson_school_bot o en el siguiente [link](https://t.me/watson_school_bot)

![alt text](readme_images/WSA_telegramNotifications.gif)