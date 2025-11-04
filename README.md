# Proyecto "Spotify" Peeps

**Marcos de Desarrollo Web**

---

## Equipo de Desarrollo

- **Loyola Ismael**
- **Figueroa Luis**
- **Montañez Fabrizio**
- **Quispe Angelo**

---

##  Requisitos Previos

### Java JDK
Descargue e instale **Java JDK 17** o superior:
- [Oracle JDK](https://www.oracle.com/java/technologies/downloads/)
- [OpenJDK](https://openjdk.org/)

### Apache Maven
Descargue e instale **Maven 3.8+**:
- [Maven Official Site](https://maven.apache.org/download.cgi)

### Verificación de Instalación

Ejecute los siguientes comandos para verificar la instalación:
```bash
java --version
mvn --version
```

---

##  Instrucciones de Configuración

### 1 Clonar el Repositorio
```bash
git clone https://github.com/Montagfth/Repositorio-008.git
cd Marcos_de_Desarrollo_Web_Proyecto/
```

### 2️ Instalar Dependencias
```bash
mvn clean install
```

Este comando descargará todas las dependencias especificadas en `pom.xml`.

---

## Ejecutar el Proyecto

### Opción 1: Usando Maven
```bash
mvn spring-boot:run
```

### Opción 2: Usando JAR compilado
```bash
mvn package
java -jar target/nombre-del-archivo.jar

```
### Opción 3: comando vs code
```bash
./mvnw spring-boot:run
```


---

## Acceso a la Aplicación

Una vez iniciado el servidor, acceda a la aplicación en:

**🔗 URL Local:** `http://localhost:8080`

> **Nota:** El puerto por defecto es `8080`. Para cambiarlo, modifique `application.properties`:
> ```properties
> server.port=PUERTO_DESEADO
> ```

---

##  Estructura del Proyecto
```
Marcos_de_Desarrollo_Web_Proyecto/
├── src/
│   ├── main/
│   │   ├── java/
│   │   └── resources/
│   └── test/
├── pom.xml
└── README.md
```

---

##  Tecnologías Utilizadas

- **Spring Boot** - Framework principal
- **Maven** - Gestión de dependencias
- **Java 17+** - Lenguaje de programación

---

##  Licencia

Este proyecto es parte de un trabajo académico para el curso de Marcos de Desarrollo Web.
