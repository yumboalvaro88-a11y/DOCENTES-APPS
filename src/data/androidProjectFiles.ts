export interface AndroidFile {
  path: string;
  category: 'config' | 'entity' | 'dao' | 'database' | 'repository' | 'excel' | 'logic' | 'di' | 'viewmodel' | 'screen' | 'manifest';
  name: string;
  description: string;
  content: string;
}

export const ANDROID_FILES: AndroidFile[] = [
  {
    path: 'build.gradle.kts (Project)',
    category: 'config',
    name: 'build.gradle.kts (Root)',
    description: 'Configuración raíz del proyecto Android con plugins de Kotlin, Android Gradle Plugin y Hilt.',
    content: `// Top-level build file where you can add configuration options common to all sub-projects/modules.
plugins {
    alias(libs.plugins.android.application) apply false
    alias(libs.plugins.kotlin.android) apply false
    alias(libs.plugins.kotlin.compose) apply false
    alias(libs.plugins.ksp) apply false
    alias(libs.plugins.hilt.android) apply false
}
`,
  },
  {
    path: 'app/build.gradle.kts',
    category: 'config',
    name: 'build.gradle.kts (App)',
    description: 'Dependencias del módulo app: Jetpack Compose Material 3, Room, Hilt, Coroutines, POI-Android.',
    content: `plugins {
    alias(libs.plugins.android.application)
    alias(libs.plugins.kotlin.android)
    alias(libs.plugins.kotlin.compose)
    alias(libs.plugins.ksp)
    alias(libs.plugins.hilt.android)
}

android {
    namespace = "com.docente.registrocalificaciones"
    compileSdk = 35

    defaultConfig {
        applicationId = "com.docente.registrocalificaciones"
        minSdk = 24
        targetSdk = 35
        versionCode = 1
        versionName = "1.0.0"

        testInstrumentationRunner = "androidx.test.runner.AndroidJUnitRunner"
        vectorDrawables {
            useSupportLibrary = true
        }
    }

    buildTypes {
        release {
            isMinifyEnabled = false
            proguardFiles(
                getDefaultProguardFile("proguard-android-optimize.txt"),
                "proguard-rules.pro"
            )
        }
    }

    compileOptions {
        sourceCompatibility = JavaVersion.VERSION_17
        targetCompatibility = JavaVersion.VERSION_17
    }

    kotlinOptions {
        jvmTarget = "17"
    }

    buildFeatures {
        compose = true
    }

    packaging {
        resources {
            excludes += "/META-INF/{AL2.0,LGPL2.1}"
            // Apache POI duplicate notice exclusions
            excludes += "META-INF/DEPENDENCIES"
            excludes += "META-INF/LICENSE*"
            excludes += "META-INF/NOTICE*"
        }
    }
}

dependencies {
    // Core Android & Lifecycle
    implementation(libs.androidx.core.ktx)
    implementation(libs.androidx.lifecycle.runtime.ktx)
    implementation(libs.androidx.lifecycle.viewmodel.compose)
    implementation(libs.androidx.activity.compose)

    // Jetpack Compose & Material 3
    implementation(platform(libs.androidx.compose.bom))
    implementation(libs.androidx.compose.ui)
    implementation(libs.androidx.compose.ui.graphics)
    implementation(libs.androidx.compose.ui.tooling.preview)
    implementation(libs.androidx.compose.material3)
    implementation(libs.androidx.compose.material.icons.extended)
    implementation(libs.androidx.navigation.compose)

    // Room Database
    implementation(libs.androidx.room.runtime)
    implementation(libs.androidx.room.ktx)
    ksp(libs.androidx.room.compiler)

    // Dagger Hilt
    implementation(libs.hilt.android)
    ksp(libs.hilt.compiler)
    implementation(libs.androidx.hilt.navigation.compose)

    // Coroutines
    implementation(libs.kotlinx.coroutines.android)

    // Excel Reading / Writing (Apache POI compatible for Android)
    // Usamos poishadow / poi-ooxml compatible con Android
    implementation("org.apache.poi:poi:5.2.5")
    implementation("org.apache.poi:poi-ooxml:5.2.5")

    // Testing
    testImplementation(libs.junit)
    androidTestImplementation(libs.androidx.junit)
    androidTestImplementation(libs.androidx.espresso.core)
    androidTestImplementation(platform(libs.androidx.compose.bom))
    androidTestImplementation(libs.androidx.compose.ui.test.junit4)
    debugImplementation(libs.androidx.compose.ui.tooling)
    debugImplementation(libs.androidx.compose.ui.test.manifest)
}
`,
  },
  {
    path: 'gradle/libs.versions.toml',
    category: 'config',
    name: 'libs.versions.toml',
    description: 'Catálogo de versiones de Gradle (Version Catalog).',
    content: `[versions]
agp = "8.7.3"
kotlin = "2.0.21"
coreKtx = "1.15.0"
junit = "4.13.2"
junitVersion = "1.2.1"
espressoCore = "3.6.1"
lifecycleRuntimeKtx = "2.8.7"
activityCompose = "1.9.3"
composeBom = "2024.12.01"
room = "2.6.1"
ksp = "2.0.21-1.0.28"
hilt = "2.52"
hiltNavigationCompose = "1.2.0"
navigationCompose = "2.8.5"
coroutines = "1.9.0"

[libraries]
androidx-core-ktx = { group = "androidx.core", name = "core-ktx", version.ref = "coreKtx" }
junit = { group = "junit", name = "junit", version.ref = "junit" }
androidx-junit = { group = "androidx.test.ext", name = "junit", version.ref = "junitVersion" }
androidx-espresso-core = { group = "androidx.test.espresso", name = "espresso-core", version.ref = "espressoCore" }
androidx-lifecycle-runtime-ktx = { group = "androidx.lifecycle", name = "lifecycle-runtime-ktx", version.ref = "lifecycleRuntimeKtx" }
androidx-lifecycle-viewmodel-compose = { group = "androidx.lifecycle", name = "lifecycle-viewmodel-compose", version.ref = "lifecycleRuntimeKtx" }
androidx-activity-compose = { group = "androidx.activity", name = "activity-compose", version.ref = "activityCompose" }
androidx-compose-bom = { group = "androidx.compose", name = "compose-bom", version.ref = "composeBom" }
androidx-compose-ui = { group = "androidx.compose.ui", name = "ui" }
androidx-compose-ui-graphics = { group = "androidx.compose.ui", name = "ui-graphics" }
androidx-compose-ui-tooling = { group = "androidx.compose.ui", name = "ui-tooling" }
androidx-compose-ui-tooling-preview = { group = "androidx.compose.ui", name = "ui-tooling-preview" }
androidx-compose-ui-test-manifest = { group = "androidx.compose.ui", name = "ui-test-manifest" }
androidx-compose-ui-test-junit4 = { group = "androidx.compose.ui", name = "ui-test-junit4" }
androidx-compose-material3 = { group = "androidx.compose.material3", name = "material3" }
androidx-compose-material-icons-extended = { group = "androidx.compose.material", name = "material-icons-extended" }
androidx-navigation-compose = { group = "androidx.navigation", name = "navigation-compose", version.ref = "navigationCompose" }
androidx-room-runtime = { group = "androidx.room", name = "room-runtime", version.ref = "room" }
androidx-room-ktx = { group = "androidx.room", name = "room-ktx", version.ref = "room" }
androidx-room-compiler = { group = "androidx.room", name = "room-compiler", version.ref = "room" }
hilt-android = { group = "com.google.dagger", name = "hilt-android", version.ref = "hilt" }
hilt-compiler = { group = "com.google.dagger", name = "hilt-android-compiler", version.ref = "hilt" }
androidx-hilt-navigation-compose = { group = "androidx.hilt", name = "hilt-navigation-compose", version.ref = "hiltNavigationCompose" }
kotlinx-coroutines-android = { group = "org.jetbrains.kotlinx", name = "kotlinx-coroutines-android", version.ref = "coroutines" }

[plugins]
android-application = { id = "com.android.application", version.ref = "agp" }
kotlin-android = { id = "org.jetbrains.kotlin.android", version.ref = "kotlin" }
kotlin-compose = { id = "org.jetbrains.kotlin.plugin.compose", version.ref = "kotlin" }
ksp = { id = "com.google.devtools.ksp", version.ref = "ksp" }
hilt-android = { id = "com.google.dagger.hilt.android", version.ref = "hilt" }
`,
  },
  {
    path: 'app/src/main/AndroidManifest.xml',
    category: 'manifest',
    name: 'AndroidManifest.xml',
    description: 'Manifiesto de la aplicación Android configurada para funcionamiento 100% offline con Storage Access Framework (sin permisos intrusivos).',
    content: `<?xml version="1.0" encoding="utf-8"?>
<manifest xmlns:android="http://schemas.android.com/apk/res/android">

    <!-- Sin permisos de almacenamiento amplio: usamos Storage Access Framework (SAF) -->
    <!-- Funciona 100% offline sin necesidad de permisos de red -->

    <application
        android:name=".RegistroCalificacionesApp"
        android:allowBackup="true"
        android:dataExtractionRules="@xml/data_extraction_rules"
        android:fullBackupContent="@xml/backup_rules"
        android:icon="@mipmap/ic_launcher"
        android:label="@string/app_name"
        android:roundIcon="@mipmap/ic_launcher_round"
        android:supportsRtl="true"
        android:theme="@style/Theme.RegistroCalificaciones">

        <activity
            android:name=".MainActivity"
            android:exported="true"
            android:label="@string/app_name"
            android:windowSoftInputMode="adjustResize"
            android:theme="@style/Theme.RegistroCalificaciones">
            <intent-filter>
                <action android:name="android.intent.action.MAIN" />
                <category android:name="android.intent.category.LAUNCHER" />
            </intent-filter>
        </activity>

    </application>

</manifest>
`,
  },
  {
    path: 'app/src/main/java/com/docente/registrocalificaciones/RegistroCalificacionesApp.kt',
    category: 'di',
    name: 'RegistroCalificacionesApp.kt',
    description: 'Clase Application anotada con @HiltAndroidApp para inicialización del grafo de inyección de dependencias.',
    content: `package com.docente.registrocalificaciones

import android.app.Application
import dagger.hilt.android.HiltAndroidApp

@HiltAndroidApp
class RegistroCalificacionesApp : Application()
`,
  },
  {
    path: 'app/src/main/java/com/docente/registrocalificaciones/data/local/entity/Entities.kt',
    category: 'entity',
    name: 'Entities.kt',
    description: 'Entidades Room: Curso, Estudiante, Categoria, Calificacion, Tarea, EntregaTarea con claves foráneas e índices.',
    content: `package com.docente.registrocalificaciones.data.local.entity

import androidx.room.Entity
import androidx.room.ForeignKey
import androidx.room.Index
import androidx.room.PrimaryKey

/**
 * 1. Entidad Curso / Paralelo
 */
@Entity(tableName = "cursos")
data class CursoEntity(
    @PrimaryKey(autoGenerate = true)
    val id: Long = 0,
    val nombre: String,           // Ej: "8vo EGB A"
    val materia: String,          // Ej: "Matemáticas"
    val anioLectivo: String,      // Ej: "2025-2026"
    val periodo: String,          // Ej: "Primer Quimestre", "1er Trimestre"
    val escalaMinima: Double = 0.0,
    val escalaMaxima: Double = 10.0,
    val umbralAprobado: Double = 7.0,
    val umbralRiesgo: Double = 5.0,
    val penalizacionPorDiaAtraso: Double = 0.5,
    val penalizacionMaximaAtraso: Double = 3.0,
    val fechaCreacion: Long = System.currentTimeMillis()
)

/**
 * 2. Entidad Estudiante
 */
@Entity(
    tableName = "estudiantes",
    foreignKeys = [
        ForeignKey(
            entity = CursoEntity::class,
            parentColumns = ["id"],
            childColumns = ["cursoId"],
            onDelete = ForeignKey.CASCADE
        )
    ],
    indices = [
        Index("cursoId"),
        Index(value = ["cursoId", "cedula"], unique = true) // Cédula única por curso
    ]
)
data class EstudianteEntity(
    @PrimaryKey(autoGenerate = true)
    val id: Long = 0,
    val cursoId: Long,
    val cedula: String,
    val apellidos: String,
    val nombres: String,
    val correo: String? = null,
    val ordenLista: Int = 0
)

/**
 * 3. Entidad Categoría de Calificación (Casillero / Ponderación)
 */
@Entity(
    tableName = "categorias",
    foreignKeys = [
        ForeignKey(
            entity = CursoEntity::class,
            parentColumns = ["id"],
            childColumns = ["cursoId"],
            onDelete = ForeignKey.CASCADE
        )
    ],
    indices = [Index("cursoId")]
)
data class CategoriaEntity(
    @PrimaryKey(autoGenerate = true)
    val id: Long = 0,
    val cursoId: Long,
    val nombre: String,             // Ej: "Tareas", "Lecciones", "Aportes", "Proyecto", "Examen"
    val pesoPorcentaje: Double,     // Ej: 20.0
    val orden: Int = 0
)

/**
 * 4. Entidad Calificación (Nota asignada en un casillero a un estudiante)
 */
@Entity(
    tableName = "calificaciones",
    foreignKeys = [
        ForeignKey(
            entity = EstudianteEntity::class,
            parentColumns = ["id"],
            childColumns = ["estudianteId"],
            onDelete = ForeignKey.CASCADE
        ),
        ForeignKey(
            entity = CategoriaEntity::class,
            parentColumns = ["id"],
            childColumns = ["categoriaId"],
            onDelete = ForeignKey.CASCADE
        )
    ],
    indices = [
        Index("estudianteId"),
        Index("categoriaId"),
        Index(value = ["estudianteId", "categoriaId"], unique = true)
    ]
)
data class CalificacionEntity(
    @PrimaryKey(autoGenerate = true)
    val id: Long = 0,
    val estudianteId: Long,
    val categoriaId: Long,
    val nota: Double?,
    val fechaModificacion: Long = System.currentTimeMillis()
)

/**
 * 5. Entidad Tarea (Control de tareas asignadas)
 */
@Entity(
    tableName = "tareas",
    foreignKeys = [
        ForeignKey(
            entity = CursoEntity::class,
            parentColumns = ["id"],
            childColumns = ["cursoId"],
            onDelete = ForeignKey.CASCADE
        )
    ],
    indices = [Index("cursoId")]
)
data class TareaEntity(
    @PrimaryKey(autoGenerate = true)
    val id: Long = 0,
    val cursoId: Long,
    val titulo: String,
    val descripcion: String,
    val fechaAsignacion: String,   // Formato YYYY-MM-DD
    val fechaLimite: String,       // Formato YYYY-MM-DD
    val notaBase: Double = 10.0
)

/**
 * 6. Entidad EntregaTarea (Registro individual de entrega por estudiante)
 */
@Entity(
    tableName = "entregas_tareas",
    foreignKeys = [
        ForeignKey(
            entity = TareaEntity::class,
            parentColumns = ["id"],
            childColumns = ["tareaId"],
            onDelete = ForeignKey.CASCADE
        ),
        ForeignKey(
            entity = EstudianteEntity::class,
            parentColumns = ["id"],
            childColumns = ["estudianteId"],
            onDelete = ForeignKey.CASCADE
        )
    ],
    indices = [
        Index("tareaId"),
        Index("estudianteId"),
        Index(value = ["tareaId", "estudianteId"], unique = true)
    ]
)
data class EntregaTareaEntity(
    @PrimaryKey(autoGenerate = true)
    val id: Long = 0,
    val tareaId: Long,
    val estudianteId: Long,
    val entregada: Boolean = false,
    val fechaEntregaReal: String? = null, // Formato YYYY-MM-DD
    val notaOriginal: Double? = null,
    val observaciones: String = ""
)
`,
  },
  {
    path: 'app/src/main/java/com/docente/registrocalificaciones/data/local/dao/Daos.kt',
    category: 'dao',
    name: 'Daos.kt',
    description: 'DAOs de Room con Flow reactivo y métodos suspend para Cursos, Estudiantes, Categorías, Calificaciones, Tareas y Entregas.',
    content: `package com.docente.registrocalificaciones.data.local.dao

import androidx.room.*
import com.docente.registrocalificaciones.data.local.entity.*
import kotlinx.coroutines.flow.Flow

@Dao
interface CursoDao {
    @Query("SELECT * FROM cursos ORDER BY fechaCreacion DESC")
    fun getAllCursos(): Flow<List<CursoEntity>>

    @Query("SELECT * FROM cursos WHERE id = :id")
    suspend fun getCursoById(id: Long): CursoEntity?

    @Query("SELECT * FROM cursos WHERE id = :id")
    fun observeCursoById(id: Long): Flow<CursoEntity?>

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertCurso(curso: CursoEntity): Long

    @Update
    suspend fun updateCurso(curso: CursoEntity)

    @Delete
    suspend fun deleteCurso(curso: CursoEntity)
}

@Dao
interface EstudianteDao {
    @Query("SELECT * FROM estudiantes WHERE cursoId = :cursoId ORDER BY apellidos ASC, nombres ASC")
    fun getEstudiantesByCurso(cursoId: Long): Flow<List<EstudianteEntity>>

    @Query("SELECT * FROM estudiantes WHERE cursoId = :cursoId ORDER BY apellidos ASC, nombres ASC")
    suspend fun getEstudiantesByCursoSync(cursoId: Long): List<EstudianteEntity>

    @Query("SELECT * FROM estudiantes WHERE cursoId = :cursoId AND (apellidos LIKE '%' || :query || '%' OR nombres LIKE '%' || :query || '%' OR cedula LIKE '%' || :query || '%') ORDER BY apellidos ASC")
    fun searchEstudiantes(cursoId: Long, query: String): Flow<List<EstudianteEntity>>

    @Insert(onConflict = OnConflictStrategy.ABORT)
    suspend fun insertEstudiante(estudiante: EstudianteEntity): Long

    @Insert(onConflict = OnConflictStrategy.ABORT)
    suspend fun insertEstudiantes(estudiantes: List<EstudianteEntity>): List<Long>

    @Update
    suspend fun updateEstudiante(estudiante: EstudianteEntity)

    @Delete
    suspend fun deleteEstudiante(estudiante: EstudianteEntity)

    @Query("SELECT cedula FROM estudiantes WHERE cursoId = :cursoId")
    suspend fun getCedulasInCurso(cursoId: Long): List<String>
}

@Dao
interface CategoriaDao {
    @Query("SELECT * FROM categorias WHERE cursoId = :cursoId ORDER BY orden ASC, id ASC")
    fun getCategoriasByCurso(cursoId: Long): Flow<List<CategoriaEntity>>

    @Query("SELECT * FROM categorias WHERE cursoId = :cursoId ORDER BY orden ASC, id ASC")
    suspend fun getCategoriasByCursoSync(cursoId: Long): List<CategoriaEntity>

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertCategoria(categoria: CategoriaEntity): Long

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertCategorias(categorias: List<CategoriaEntity>): List<Long>

    @Update
    suspend fun updateCategoria(categoria: CategoriaEntity)

    @Delete
    suspend fun deleteCategoria(categoria: CategoriaEntity)
}

@Dao
interface CalificacionDao {
    @Query("SELECT * FROM calificaciones WHERE estudianteId IN (SELECT id FROM estudiantes WHERE cursoId = :cursoId)")
    fun getCalificacionesByCurso(cursoId: Long): Flow<List<CalificacionEntity>>

    @Query("SELECT * FROM calificaciones WHERE estudianteId = :estudianteId")
    fun getCalificacionesByEstudiante(estudianteId: Long): Flow<List<CalificacionEntity>>

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertOrUpdateCalificacion(calificacion: CalificacionEntity): Long

    @Query("DELETE FROM calificaciones WHERE estudianteId = :estudianteId AND categoriaId = :categoriaId")
    suspend fun deleteCalificacion(estudianteId: Long, categoriaId: Long)
}

@Dao
interface TareaDao {
    @Query("SELECT * FROM tareas WHERE cursoId = :cursoId ORDER BY fechaLimite DESC")
    fun getTareasByCurso(cursoId: Long): Flow<List<TareaEntity>>

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertTarea(tarea: TareaEntity): Long

    @Update
    suspend fun updateTarea(tarea: TareaEntity)

    @Delete
    suspend fun deleteTarea(tarea: TareaEntity)
}

@Dao
interface EntregaTareaDao {
    @Query("SELECT * FROM entregas_tareas WHERE tareaId = :tareaId")
    fun getEntregasByTarea(tareaId: Long): Flow<List<EntregaTareaEntity>>

    @Query("SELECT * FROM entregas_tareas WHERE estudianteId = :estudianteId")
    fun getEntregasByEstudiante(estudianteId: Long): Flow<List<EntregaTareaEntity>>

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertOrUpdateEntrega(entrega: EntregaTareaEntity): Long

    @Insert(onConflict = OnConflictStrategy.IGNORE)
    suspend fun insertBatchEntregas(entregas: List<EntregaTareaEntity>)
}
`,
  },
  {
    path: 'app/src/main/java/com/docente/registrocalificaciones/data/local/AppDatabase.kt',
    category: 'database',
    name: 'AppDatabase.kt',
    description: 'Definición de RoomDatabase con pre-poblado automático de categorías iniciales por defecto.',
    content: `package com.docente.registrocalificaciones.data.local

import android.content.Context
import androidx.room.Database
import androidx.room.Room
import androidx.room.RoomDatabase
import com.docente.registrocalificaciones.data.local.dao.*
import com.docente.registrocalificaciones.data.local.entity.*

@Database(
    entities = [
        CursoEntity::class,
        EstudianteEntity::class,
        CategoriaEntity::class,
        CalificacionEntity::class,
        TareaEntity::class,
        EntregaTareaEntity::class
    ],
    version = 1,
    exportSchema = false
)
abstract class AppDatabase : RoomDatabase() {
    abstract fun cursoDao(): CursoDao
    abstract fun estudianteDao(): EstudianteDao
    abstract fun categoriaDao(): CategoriaDao
    abstract fun calificacionDao(): CalificacionDao
    abstract fun tareaDao(): TareaDao
    abstract fun entregaTareaDao(): EntregaTareaDao

    companion object {
        const val DATABASE_NAME = "registro_calificaciones.db"

        fun buildDatabase(context: Context): AppDatabase {
            return Room.databaseBuilder(
                context.applicationContext,
                AppDatabase::class.java,
                DATABASE_NAME
            )
            .fallbackToDestructiveMigration()
            .build()
        }
    }
}
`,
  },
  {
    path: 'app/src/main/java/com/docente/registrocalificaciones/domain/calculation/GradeCalculator.kt',
    category: 'logic',
    name: 'GradeCalculator.kt',
    description: 'Lógica matemática pura: cálculo de promedio ponderado, días de atraso, penalización y estado del estudiante.',
    content: `package com.docente.registrocalificaciones.domain.calculation

import java.time.LocalDate
import java.time.temporal.ChronoUnit
import kotlin.math.max
import kotlin.math.min
import kotlin.math.roundToInt

enum class EstadoCalificacion {
    APROBADO,
    EN_RIESGO,
    REPROBADO
}

enum class EstadoEntregaTarea {
    A_TIEMPO,
    CON_ATRASO,
    PENDIENTE,
    NO_ENTREGO
}

data class ResultadoCalculoAtraso(
    val diasAtraso: Long,
    val estado: EstadoEntregaTarea,
    val descripcionEstado: String,
    val penalizacion: Double,
    val notaFinalAjustada: Double?
)

object GradeCalculator {

    /**
     * Calcula el promedio ponderado basado en las notas ingresadas y el peso de cada categoría.
     * Si no se han ingresado todas las notas, normaliza proporcionalmente sobre las evaluadas.
     */
    fun calcularPromedioPonderado(
        calificacionesMap: Map<Long, Double?>, // categoriaId -> nota
        categoriasPesos: Map<Long, Double>     // categoriaId -> pesoPorcentaje (ej 20.0)
    ): Double? {
        var sumaPonderada = 0.0
        var sumaPesosEvaluados = 0.0
        var tieneAlMenosUnaNota = false

        categoriasPesos.forEach { (catId, peso) ->
            val nota = calificacionesMap[catId]
            if (nota != null && !nota.isNaN()) {
                sumaPonderada += nota * (peso / 100.0)
                sumaPesosEvaluados += peso
                tieneAlMenosUnaNota = true
            }
        }

        if (!tieneAlMenosUnaNota || sumaPesosEvaluados <= 0.0) return null

        val promedioFinal = if (sumaPesosEvaluados == 100.0) {
            sumaPonderada
        } else {
            (sumaPonderada / sumaPesosEvaluados) * 100.0
        }

        return (promedioFinal * 100.0).roundToInt() / 100.0
    }

    /**
     * Determina el estado del estudiante según la nota obtenida
     */
    fun determinarEstado(
        nota: Double?,
        umbralAprobado: Double = 7.0,
        umbralRiesgo: Double = 5.0
    ): EstadoCalificacion? {
        if (nota == null) return null
        return when {
            nota >= umbralAprobado -> EstadoCalificacion.APROBADO
            nota >= umbralRiesgo -> EstadoCalificacion.EN_RIESGO
            else -> EstadoCalificacion.REPROBADO
        }
    }

    /**
     * Calcula días de atraso, estado y penalización aplicable.
     * Fechas en formato ISO: "YYYY-MM-DD"
     */
    fun calcularAtrasoYPenalizacion(
        fechaLimiteStr: String,
        fechaEntregaRealStr: String?,
        entregada: Boolean,
        notaOriginal: Double?,
        penalizacionPorDia: Double = 0.5,
        penalizacionMaxima: Double = 3.0,
        fechaHoy: LocalDate = LocalDate.now()
    ): ResultadoCalculoAtraso {
        val fechaLimite = runCatching { LocalDate.parse(fechaLimiteStr) }.getOrDefault(LocalDate.now())

        return if (entregada && !fechaEntregaRealStr.isNullOrBlank()) {
            val fechaEntrega = runCatching { LocalDate.parse(fechaEntregaRealStr) }.getOrDefault(fechaLimite)
            val dias = ChronoUnit.DAYS.between(fechaLimite, fechaEntrega)

            if (dias > 0) {
                val penalizacion = min(penalizacionMaxima, dias * penalizacionPorDia)
                val notaAjustada = notaOriginal?.let { max(0.0, it - penalizacion) }
                ResultadoCalculoAtraso(
                    diasAtraso = dias,
                    estado = EstadoEntregaTarea.CON_ATRASO,
                    descripcionEstado = "Entregada con atraso ($dias \${if (dias == 1L) "día" else "días"})",
                    penalizacion = penalizacion,
                    notaFinalAjustada = notaAjustada?.let { (it * 100.0).roundToInt() / 100.0 }
                )
            } else {
                ResultadoCalculoAtraso(
                    diasAtraso = 0,
                    estado = EstadoEntregaTarea.A_TIEMPO,
                    descripcionEstado = "Entregada a tiempo",
                    penalizacion = 0.0,
                    notaFinalAjustada = notaOriginal
                )
            }
        } else if (entregada) {
            ResultadoCalculoAtraso(
                diasAtraso = 0,
                estado = EstadoEntregaTarea.A_TIEMPO,
                descripcionEstado = "Entregada a tiempo",
                penalizacion = 0.0,
                notaFinalAjustada = notaOriginal
            )
        } else {
            // Aún no entregada
            val dias = ChronoUnit.DAYS.between(fechaLimite, fechaHoy)
            if (dias > 0) {
                val penalizacion = min(penalizacionMaxima, dias * penalizacionPorDia)
                ResultadoCalculoAtraso(
                    diasAtraso = dias,
                    estado = EstadoEntregaTarea.NO_ENTREGO,
                    descripcionEstado = "Atrasada sin entregar ($dias \${if (dias == 1L) "día" else "días"})",
                    penalizacion = penalizacion,
                    notaFinalAjustada = null
                )
            } else {
                ResultadoCalculoAtraso(
                    diasAtraso = 0,
                    estado = EstadoEntregaTarea.PENDIENTE,
                    descripcionEstado = "Pendiente (dentro del plazo)",
                    penalizacion = 0.0,
                    notaFinalAjustada = null
                )
            }
        }
    }
}
`,
  },
  {
    path: 'app/src/main/java/com/docente/registrocalificaciones/data/excel/ExcelImporter.kt',
    category: 'excel',
    name: 'ExcelImporter.kt',
    description: 'Lector de archivos Excel (.xlsx y .xls) mediante Apache POI con Storage Access Framework (SAF), validación exhaustiva y generación de reportes.',
    content: `package com.docente.registrocalificaciones.data.excel

import android.content.Context
import android.net.Uri
import com.docente.registrocalificaciones.data.local.entity.EstudianteEntity
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext
import org.apache.poi.ss.usermodel.*
import java.io.InputStream

data class FilaEstudianteImportado(
    val numeroFila: Int,
    val cedula: String,
    val apellidos: String,
    val nombres: String,
    val correo: String?,
    val esValido: Boolean,
    val errores: List<String>
)

data class ResultadoImportacionExcel(
    val totalLeidas: Int,
    val filasValidas: List<FilaEstudianteImportado>,
    val filasConError: List<FilaEstudianteImportado>,
    val cedulasDuplicadasEnArchivo: Set<String>,
    val mensajeResumen: String
)

class ExcelImporter(private val context: Context) {

    /**
     * Lee un archivo Excel seleccionado mediante SAF (Uri) y valida cada fila
     */
    suspend fun importarNominaDesdeUri(
        fileUri: Uri,
        cursoId: Long,
        cedulasExistentesEnCurso: Set<String>
    ): ResultadoImportacionExcel = withContext(Dispatchers.IO) {
        val inputStream: InputStream? = context.contentResolver.openInputStream(fileUri)
            ?: throw IllegalArgumentException("No se pudo abrir el archivo seleccionado")

        val filas = mutableListOf<FilaEstudianteImportado>()
        val cedulasVistasEnArchivo = mutableSetOf<String>()
        val cedulasDuplicadas = mutableSetOf<String>()

        inputStream.use { stream ->
            val workbook = WorkbookFactory.create(stream)
            val sheet = workbook.getSheetAt(0)
                ?: throw IllegalArgumentException("El archivo Excel no contiene hojas de cálculo")

            val totalFilas = sheet.physicalNumberOfRows
            if (totalFilas <= 1) {
                return@withContext ResultadoImportacionExcel(
                    totalLeidas = 0,
                    filasValidas = emptyList(),
                    filasConError = emptyList(),
                    cedulasDuplicadasEnArchivo = emptySet(),
                    mensajeResumen = "El archivo no contiene datos de estudiantes"
                )
            }

            // Identificar índices de columnas en la cabecera (Fila 0 o 1)
            var colIndexCedula = 1
            var colIndexApellidos = 2
            var colIndexNombres = 3
            var colIndexCorreo = 4

            val cabecera = sheet.getRow(0)
            if (cabecera != null) {
                for (cn in 0 until cabecera.lastCellNum) {
                    val cellText = getCellStringValue(cabecera.getCell(cn)).lowercase().trim()
                    when {
                        cellText.contains("cedula") || cellText.contains("dni") || cellText.contains("id") || cellText.contains("identificacion") -> colIndexCedula = cn
                        cellText.contains("apellido") -> colIndexApellidos = cn
                        cellText.contains("nombre") -> colIndexNombres = cn
                        cellText.contains("correo") || cellText.contains("email") -> colIndexCorreo = cn
                    }
                }
            }

            // Procesar filas de datos
            for (rn in 1..sheet.lastRowNum) {
                val row = sheet.getRow(rn) ?: continue

                val cedulaRaw = getCellStringValue(row.getCell(colIndexCedula)).trim()
                val apellidosRaw = getCellStringValue(row.getCell(colIndexApellidos)).trim()
                val nombresRaw = getCellStringValue(row.getCell(colIndexNombres)).trim()
                val correoRaw = if (colIndexCorreo >= 0) getCellStringValue(row.getCell(colIndexCorreo)).trim() else ""

                // Si toda la fila está vacía, se ignora
                if (cedulaRaw.isBlank() && apellidosRaw.isBlank() && nombresRaw.isBlank()) {
                    continue
                }

                val errores = mutableListOf<String>()

                // Validación 1: Cédula obligatoria
                if (cedulaRaw.isBlank()) {
                    errores.add("La cédula o ID es obligatoria")
                } else {
                    val cedulaNormalizada = cedulaRaw.lowercase()
                    // Validación 2: Duplicada en el mismo archivo
                    if (cedulasVistasEnArchivo.contains(cedulaNormalizada)) {
                        errores.add("Cédula duplicada en este archivo: $cedulaRaw")
                        cedulasDuplicadas.add(cedulaRaw)
                    } else {
                        cedulasVistasEnArchivo.add(cedulaNormalizada)
                    }

                    // Validación 3: Ya existe en la base de datos del curso
                    if (cedulasExistentesEnCurso.contains(cedulaNormalizada)) {
                        errores.add("Esta cédula ya está registrada en este curso")
                    }
                }

                // Validación 4: Apellidos y nombres obligatorios
                if (apellidosRaw.isBlank()) errores.add("Falta el apellido")
                if (nombresRaw.isBlank()) errores.add("Falta el nombre")

                // Validación 5: Correo válido si está presente
                if (correoRaw.isNotBlank() && !android.util.Patterns.EMAIL_ADDRESS.matcher(correoRaw).matches()) {
                    errores.add("Formato de correo no válido: $correoRaw")
                }

                filas.add(
                    FilaEstudianteImportado(
                        numeroFila = rn + 1,
                        cedula = cedulaRaw,
                        apellidos = apellidosRaw,
                        nombres = nombresRaw,
                        correo = if (correoRaw.isNotBlank()) correoRaw else null,
                        esValido = errores.isEmpty(),
                        errores = errores
                    )
                )
            }
        }

        val validas = filas.filter { it.esValido }
        val invalidas = filas.filter { !it.esValido }

        ResultadoImportacionExcel(
            totalLeidas = filas.size,
            filasValidas = validas,
            filasConError = invalidas,
            cedulasDuplicadasEnArchivo = cedulasDuplicadas,
            mensajeResumen = "Se leyeron \${filas.size} filas: \${validas.size} válidas, \${invalidas.size} con advertencias o errores."
        )
    }

    private fun getCellStringValue(cell: Cell?): String {
        if (cell == null) return ""
        return when (cell.cellType) {
            CellType.STRING -> cell.stringCellValue
            CellType.NUMERIC -> {
                if (DateUtil.isCellDateFormatted(cell)) {
                    cell.localDateTimeCellValue.toLocalDate().toString()
                } else {
                    val num = cell.numericCellValue
                    if (num == num.toLong().toDouble()) {
                        num.toLong().toString()
                    } else {
                        num.toString()
                    }
                }
            }
            CellType.BOOLEAN -> cell.booleanCellValue.toString()
            CellType.FORMULA -> {
                runCatching { cell.stringCellValue }
                    .getOrElse { runCatching { cell.numericCellValue.toString() }.getOrDefault("") }
            }
            else -> ""
        }
    }
}
`,
  },
  {
    path: 'app/src/main/java/com/docente/registrocalificaciones/data/repository/CalificacionesRepository.kt',
    category: 'repository',
    name: 'CalificacionesRepository.kt',
    description: 'Interfaz y repositorio de datos completo con Kotlin Coroutines y Flow.',
    content: `package com.docente.registrocalificaciones.data.repository

import com.docente.registrocalificaciones.data.local.dao.*
import com.docente.registrocalificaciones.data.local.entity.*
import kotlinx.coroutines.flow.Flow
import javax.inject.Inject
import javax.inject.Singleton

interface CalificacionesRepository {
    // Cursos
    fun getCursos(): Flow<List<CursoEntity>>
    suspend fun getCursoById(id: Long): CursoEntity?
    fun observeCursoById(id: Long): Flow<CursoEntity?>
    suspend fun crearCurso(curso: CursoEntity): Long
    suspend fun actualizarCurso(curso: CursoEntity)
    suspend fun eliminarCurso(curso: CursoEntity)

    // Estudiantes
    fun getEstudiantesByCurso(cursoId: Long): Flow<List<EstudianteEntity>>
    suspend fun getEstudiantesByCursoSync(cursoId: Long): List<EstudianteEntity>
    fun searchEstudiantes(cursoId: Long, query: String): Flow<List<EstudianteEntity>>
    suspend fun agregarEstudiante(estudiante: EstudianteEntity): Long
    suspend fun agregarEstudiantesBatch(estudiantes: List<EstudianteEntity>): List<Long>
    suspend fun actualizarEstudiante(estudiante: EstudianteEntity)
    suspend fun eliminarEstudiante(estudiante: EstudianteEntity)
    suspend fun getCedulasExistentes(cursoId: Long): Set<String>

    // Categorias
    fun getCategoriasByCurso(cursoId: Long): Flow<List<CategoriaEntity>>
    suspend fun getCategoriasByCursoSync(cursoId: Long): List<CategoriaEntity>
    suspend fun crearCategoria(categoria: CategoriaEntity): Long
    suspend fun actualizarCategoria(categoria: CategoriaEntity)
    suspend fun eliminarCategoria(categoria: CategoriaEntity)

    // Calificaciones
    fun getCalificacionesByCurso(cursoId: Long): Flow<List<CalificacionEntity>>
    suspend fun registrarCalificacion(estudianteId: Long, categoriaId: Long, nota: Double?)

    // Tareas & Entregas
    fun getTareasByCurso(cursoId: Long): Flow<List<TareaEntity>>
    suspend fun crearTarea(tarea: TareaEntity): Long
    suspend fun eliminarTarea(tarea: TareaEntity)
    fun getEntregasByTarea(tareaId: Long): Flow<List<EntregaTareaEntity>>
    suspend fun registrarEntrega(entrega: EntregaTareaEntity)
}

@Singleton
class CalificacionesRepositoryImpl @Inject constructor(
    private val cursoDao: CursoDao,
    private val estudianteDao: EstudianteDao,
    private val categoriaDao: CategoriaDao,
    private val calificacionDao: CalificacionDao,
    private val tareaDao: TareaDao,
    private val entregaTareaDao: EntregaTareaDao
) : CalificacionesRepository {

    override fun getCursos(): Flow<List<CursoEntity>> = cursoDao.getAllCursos()
    override suspend fun getCursoById(id: Long): CursoEntity? = cursoDao.getCursoById(id)
    override fun observeCursoById(id: Long): Flow<CursoEntity?> = cursoDao.observeCursoById(id)

    override suspend fun crearCurso(curso: CursoEntity): Long {
        val cursoId = cursoDao.insertCurso(curso)
        // Crear categorías por defecto: Tareas, Lecciones, Aportes, Proyecto, Examen (20% c/u)
        val categoriasIniciales = listOf(
            CategoriaEntity(cursoId = cursoId, nombre = "Tareas", pesoPorcentaje = 20.0, orden = 1),
            CategoriaEntity(cursoId = cursoId, nombre = "Lecciones", pesoPorcentaje = 20.0, orden = 2),
            CategoriaEntity(cursoId = cursoId, nombre = "Aportes", pesoPorcentaje = 20.0, orden = 3),
            CategoriaEntity(cursoId = cursoId, nombre = "Proyecto", pesoPorcentaje = 20.0, orden = 4),
            CategoriaEntity(cursoId = cursoId, nombre = "Examen", pesoPorcentaje = 20.0, orden = 5)
        )
        categoriaDao.insertCategorias(categoriasIniciales)
        return cursoId
    }

    override suspend fun actualizarCurso(curso: CursoEntity) = cursoDao.updateCurso(curso)
    override suspend fun eliminarCurso(curso: CursoEntity) = cursoDao.deleteCurso(curso)

    override fun getEstudiantesByCurso(cursoId: Long): Flow<List<EstudianteEntity>> =
        estudianteDao.getEstudiantesByCurso(cursoId)

    override suspend fun getEstudiantesByCursoSync(cursoId: Long): List<EstudianteEntity> =
        estudianteDao.getEstudiantesByCursoSync(cursoId)

    override fun searchEstudiantes(cursoId: Long, query: String): Flow<List<EstudianteEntity>> =
        estudianteDao.searchEstudiantes(cursoId, query)

    override suspend fun agregarEstudiante(estudiante: EstudianteEntity): Long =
        estudianteDao.insertEstudiante(estudiante)

    override suspend fun agregarEstudiantesBatch(estudiantes: List<EstudianteEntity>): List<Long> =
        estudianteDao.insertEstudiantes(estudiantes)

    override suspend fun actualizarEstudiante(estudiante: EstudianteEntity) =
        estudianteDao.updateEstudiante(estudiante)

    override suspend fun eliminarEstudiante(estudiante: EstudianteEntity) =
        estudianteDao.deleteEstudiante(estudiante)

    override suspend fun getCedulasExistentes(cursoId: Long): Set<String> =
        estudianteDao.getCedulasInCurso(cursoId).map { it.lowercase() }.toSet()

    override fun getCategoriasByCurso(cursoId: Long): Flow<List<CategoriaEntity>> =
        categoriaDao.getCategoriasByCurso(cursoId)

    override suspend fun getCategoriasByCursoSync(cursoId: Long): List<CategoriaEntity> =
        categoriaDao.getCategoriasByCursoSync(cursoId)

    override suspend fun crearCategoria(categoria: CategoriaEntity): Long =
        categoriaDao.insertCategoria(categoria)

    override suspend fun actualizarCategoria(categoria: CategoriaEntity) =
        categoriaDao.updateCategoria(categoria)

    override suspend fun eliminarCategoria(categoria: CategoriaEntity) =
        categoriaDao.deleteCategoria(categoria)

    override fun getCalificacionesByCurso(cursoId: Long): Flow<List<CalificacionEntity>> =
        calificacionDao.getCalificacionesByCurso(cursoId)

    override suspend fun registrarCalificacion(estudianteId: Long, categoriaId: Long, nota: Double?) {
        calificacionDao.insertOrUpdateCalificacion(
            CalificacionEntity(
                estudianteId = estudianteId,
                categoriaId = categoriaId,
                nota = nota
            )
        )
    }

    override fun getTareasByCurso(cursoId: Long): Flow<List<TareaEntity>> =
        tareaDao.getTareasByCurso(cursoId)

    override suspend fun crearTarea(tarea: TareaEntity): Long {
        val tareaId = tareaDao.insertTarea(tarea)
        // Generar entregas iniciales pendientes para todos los alumnos del curso
        val alumnos = estudianteDao.getEstudiantesByCursoSync(tarea.cursoId)
        val entregasIniciales = alumnos.map {
            EntregaTareaEntity(
                tareaId = tareaId,
                estudianteId = it.id,
                entregada = false,
                fechaEntregaReal = null,
                notaOriginal = null
            )
        }
        entregaTareaDao.insertBatchEntregas(entregasIniciales)
        return tareaId
    }

    override suspend fun eliminarTarea(tarea: TareaEntity) = tareaDao.deleteTarea(tarea)

    override fun getEntregasByTarea(tareaId: Long): Flow<List<EntregaTareaEntity>> =
        entregaTareaDao.getEntregasByTarea(tareaId)

    override suspend fun registrarEntrega(entrega: EntregaTareaEntity) {
        entregaTareaDao.insertOrUpdateEntrega(entrega)
    }
}
`,
  },
  {
    path: 'app/src/main/java/com/docente/registrocalificaciones/di/AppModule.kt',
    category: 'di',
    name: 'AppModule.kt',
    description: 'Módulo de Hilt que provee la Base de Datos Room, DAOs, el Repositorio y el importador Excel.',
    content: `package com.docente.registrocalificaciones.di

import android.content.Context
import com.docente.registrocalificaciones.data.excel.ExcelImporter
import com.docente.registrocalificaciones.data.local.AppDatabase
import com.docente.registrocalificaciones.data.local.dao.*
import com.docente.registrocalificaciones.data.repository.CalificacionesRepository
import com.docente.registrocalificaciones.data.repository.CalificacionesRepositoryImpl
import dagger.Module
import dagger.Provides
import dagger.hilt.InstallIn
import dagger.hilt.android.qualifiers.ApplicationContext
import dagger.hilt.components.SingletonComponent
import javax.inject.Singleton

@Module
@InstallIn(SingletonComponent::class)
object AppModule {

    @Provides
    @Singleton
    fun provideDatabase(@ApplicationContext context: Context): AppDatabase {
        return AppDatabase.buildDatabase(context)
    }

    @Provides
    fun provideCursoDao(db: AppDatabase): CursoDao = db.cursoDao()

    @Provides
    fun provideEstudianteDao(db: AppDatabase): EstudianteDao = db.estudianteDao()

    @Provides
    fun provideCategoriaDao(db: AppDatabase): CategoriaDao = db.categoriaDao()

    @Provides
    fun provideCalificacionDao(db: AppDatabase): CalificacionDao = db.calificacionDao()

    @Provides
    fun provideTareaDao(db: AppDatabase): TareaDao = db.tareaDao()

    @Provides
    fun provideEntregaTareaDao(db: AppDatabase): EntregaTareaDao = db.entregaTareaDao()

    @Provides
    @Singleton
    fun provideExcelImporter(@ApplicationContext context: Context): ExcelImporter {
        return ExcelImporter(context)
    }

    @Provides
    @Singleton
    fun provideCalificacionesRepository(
        cursoDao: CursoDao,
        estudianteDao: EstudianteDao,
        categoriaDao: CategoriaDao,
        calificacionDao: CalificacionDao,
        tareaDao: TareaDao,
        entregaTareaDao: EntregaTareaDao
    ): CalificacionesRepository {
        return CalificacionesRepositoryImpl(
            cursoDao,
            estudianteDao,
            categoriaDao,
            calificacionDao,
            tareaDao,
            entregaTareaDao
        )
    }
}
`,
  },
  {
    path: 'app/src/main/java/com/docente/registrocalificaciones/ui/viewmodel/PlanillaViewModel.kt',
    category: 'viewmodel',
    name: 'PlanillaViewModel.kt',
    description: 'ViewModel con Hilt para la Planilla de calificaciones, con autoguardado, cálculo de promedios y filtros.',
    content: `package com.docente.registrocalificaciones.ui.viewmodel

import androidx.lifecycle.SavedStateHandle
import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.docente.registrocalificaciones.data.local.entity.CalificacionEntity
import com.docente.registrocalificaciones.data.local.entity.CategoriaEntity
import com.docente.registrocalificaciones.data.local.entity.CursoEntity
import com.docente.registrocalificaciones.data.local.entity.EstudianteEntity
import com.docente.registrocalificaciones.data.repository.CalificacionesRepository
import com.docente.registrocalificaciones.domain.calculation.GradeCalculator
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.flow.*
import kotlinx.coroutines.launch
import javax.inject.Inject

data class FilaEstudiantePlanilla(
    val estudiante: EstudianteEntity,
    val notasPorCategoria: Map<Long, Double?>,
    val promedioFinal: Double?,
    val estado: String // "Aprobado", "En Riesgo", "Reprobado"
)

data class PlanillaUiState(
    val curso: CursoEntity? = null,
    val categorias: List<CategoriaEntity> = emptyList(),
    val filas: List<FilaEstudiantePlanilla> = emptyList(),
    val searchQuery: String = "",
    val promedioGeneralCurso: Double = 0.0,
    val totalAprobados: Int = 0,
    val totalEnRiesgo: Int = 0,
    val totalReprobados: Int = 0,
    val isLoading: Boolean = true,
    val mensajeError: String? = null
)

@HiltViewModel
class PlanillaViewModel @Inject constructor(
    private val repository: CalificacionesRepository,
    savedStateHandle: SavedStateHandle
) : ViewModel() {

    private val cursoId: Long = checkNotNull(savedStateHandle["cursoId"])

    private val _searchQuery = MutableStateFlow("")

    val uiState: StateFlow<PlanillaUiState> = combine(
        repository.observeCursoById(cursoId),
        repository.getCategoriasByCurso(cursoId),
        repository.getEstudiantesByCurso(cursoId),
        repository.getCalificacionesByCurso(cursoId),
        _searchQuery
    ) { curso, categorias, estudiantes, calificaciones, query ->
        if (curso == null) {
            return@combine PlanillaUiState(isLoading = false, mensajeError = "Curso no encontrado")
        }

        val pesosMap = categorias.associate { it.id to it.pesoPorcentaje }
        val calificacionesAgrupadas = calificaciones.groupBy { it.estudianteId }

        val estudiantesFiltrados = if (query.isBlank()) {
            estudiantes
        } else {
            estudiantes.filter {
                it.apellidos.contains(query, ignoreCase = true) ||
                it.nombres.contains(query, ignoreCase = true) ||
                it.cedula.contains(query, ignoreCase = true)
            }
        }

        var aprobadosCount = 0
        var enRiesgoCount = 0
        var reprobadosCount = 0
        var sumaPromedios = 0.0
        var totalConPromedio = 0

        val filas = estudiantesFiltrados.map { est ->
            val notasEst = calificacionesAgrupadas[est.id]?.associate { it.categoriaId to it.nota } ?: emptyMap()
            val prom = GradeCalculator.calcularPromedioPonderado(notasEst, pesosMap)

            val estado = when {
                prom == null -> "Sin calificar"
                prom >= curso.umbralAprobado -> {
                    aprobadosCount++
                    "Aprobado"
                }
                prom >= curso.umbralRiesgo -> {
                    enRiesgoCount++
                    "En Riesgo"
                }
                else -> {
                    reprobadosCount++
                    "Reprobado"
                }
            }

            if (prom != null) {
                sumaPromedios += prom
                totalConPromedio++
            }

            FilaEstudiantePlanilla(
                estudiante = est,
                notasPorCategoria = notasEst,
                promedioFinal = prom,
                estado = estado
            )
        }

        val promedioGeneral = if (totalConPromedio > 0) {
            (sumaPromedios / totalConPromedio * 100.0).let { Math.round(it) / 100.0 }
        } else 0.0

        PlanillaUiState(
            curso = curso,
            categorias = categorias,
            filas = filas,
            searchQuery = query,
            promedioGeneralCurso = promedioGeneral,
            totalAprobados = aprobadosCount,
            totalEnRiesgo = enRiesgoCount,
            totalReprobados = reprobadosCount,
            isLoading = false
        )
    }.stateIn(
        scope = viewModelScope,
        started = SharingStarted.WhileSubscribed(5000),
        initialValue = PlanillaUiState()
    )

    fun onSearchQueryChanged(newQuery: String) {
        _searchQuery.value = newQuery
    }

    /**
     * Autoguardado al modificar la celda de un estudiante
     */
    fun actualizarNota(estudianteId: Long, categoriaId: Long, notaTexto: String) {
        viewModelScope.launch {
            val notaDouble = notaTexto.trim().toDoubleOrNull()
            repository.registrarCalificacion(estudianteId, categoriaId, notaDouble)
        }
    }

    fun agregarNuevaCategoria(nombre: String, peso: Double) {
        viewModelScope.launch {
            repository.crearCategoria(
                CategoriaEntity(
                    cursoId = cursoId,
                    nombre = nombre,
                    pesoPorcentaje = peso,
                    orden = uiState.value.categorias.size + 1
                )
            )
        }
    }

    fun eliminarCategoria(categoria: CategoriaEntity) {
        viewModelScope.launch {
            repository.eliminarCategoria(categoria)
        }
    }
}
`,
  },
  {
    path: 'app/src/main/java/com/docente/registrocalificaciones/ui/screens/planilla/PlanillaScreen.kt',
    category: 'screen',
    name: 'PlanillaScreen.kt',
    description: 'Pantalla Compose con tabla tipo hoja de cálculo: columna fija de estudiantes, casilleros editables, autoguardado y colores dinámicos.',
    content: `package com.docente.registrocalificaciones.ui.screens.planilla

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.horizontalScroll
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.itemsIndexed
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.text.KeyboardOptions
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.input.KeyboardType
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.hilt.navigation.compose.hiltViewModel
import com.docente.registrocalificaciones.ui.viewmodel.PlanillaViewModel

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun PlanillaScreen(
    onNavigateBack: () -> Unit,
    onNavigateToTareas: () -> Unit,
    onNavigateToReportes: () -> Unit,
    viewModel: PlanillaViewModel = hiltViewModel()
) {
    val uiState by viewModel.uiState.collectAsState()
    val scrollHorizontalHeader = rememberScrollState()
    val scrollHorizontalBody = rememberScrollState()

    // Sincronizar scroll horizontal
    LaunchedEffect(scrollHorizontalHeader.value) {
        scrollHorizontalBody.scrollTo(scrollHorizontalHeader.value)
    }

    Scaffold(
        topBar = {
            TopAppBar(
                title = {
                    Column {
                        Text(
                            text = uiState.curso?.nombre ?: "Planilla de Calificaciones",
                            style = MaterialTheme.typography.titleMedium,
                            fontWeight = FontWeight.Bold
                        )
                        Text(
                            text = "\${uiState.curso?.materia ?: ""} • \${uiState.curso?.periodo ?: ""}",
                            style = MaterialTheme.typography.bodySmall,
                            color = MaterialTheme.colorScheme.onSurfaceVariant
                        )
                    }
                },
                navigationIcon = {
                    IconButton(onClick = onNavigateBack) {
                        Icon(Icons.Default.ArrowBack, contentDescription = "Regresar")
                    }
                },
                actions = {
                    IconButton(onClick = onNavigateToTareas) {
                        Icon(Icons.Default.AssignmentTurnedIn, contentDescription = "Control de Tareas")
                    }
                    IconButton(onClick = onNavigateToReportes) {
                        Icon(Icons.Default.BarChart, contentDescription = "Reportes")
                    }
                }
            )
        }
    ) { paddingValues ->
        if (uiState.isLoading) {
            Box(Modifier.fillMaxSize(), contentAlignment = Alignment.Center) {
                CircularProgressIndicator()
            }
            return@Scaffold
        }

        Column(
            modifier = Modifier
                .fillMaxSize()
                .padding(paddingValues)
        ) {
            // Barra de búsqueda rápida
            OutlinedTextField(
                value = uiState.searchQuery,
                onValueChange = viewModel::onSearchQueryChanged,
                placeholder = { Text("Buscar por apellido, nombre o cédula...") },
                leadingIcon = { Icon(Icons.Default.Search, contentDescription = null) },
                singleLine = true,
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(horizontal = 16.dp, vertical = 8.dp)
            )

            // Resumen de rendimiento en encabezado
            Card(
                colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surfaceVariant),
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(horizontal = 16.dp, vertical = 4.dp)
            ) {
                Row(
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(12.dp),
                    horizontalArrangement = Arrangement.SpaceAround,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Column(horizontalAlignment = Alignment.CenterHorizontally) {
                        Text("Promedio Curso", fontSize = 11.sp, color = MaterialTheme.colorScheme.onSurfaceVariant)
                        Text(
                            text = uiState.promedioGeneralCurso.toString(),
                            fontWeight = FontWeight.Bold,
                            fontSize = 16.sp,
                            color = MaterialTheme.colorScheme.primary
                        )
                    }
                    Column(horizontalAlignment = Alignment.CenterHorizontally) {
                        Text("Aprobados", fontSize = 11.sp, color = Color(0xFF2E7D32))
                        Text(uiState.totalAprobados.toString(), fontWeight = FontWeight.Bold, fontSize = 15.sp, color = Color(0xFF2E7D32))
                    }
                    Column(horizontalAlignment = Alignment.CenterHorizontally) {
                        Text("En Riesgo", fontSize = 11.sp, color = Color(0xFFF57F17))
                        Text(uiState.totalEnRiesgo.toString(), fontWeight = FontWeight.Bold, fontSize = 15.sp, color = Color(0xFFF57F17))
                    }
                    Column(horizontalAlignment = Alignment.CenterHorizontally) {
                        Text("Reprobados", fontSize = 11.sp, color = Color(0xFFC62828))
                        Text(uiState.totalReprobados.toString(), fontWeight = FontWeight.Bold, fontSize = 15.sp, color = Color(0xFFC62828))
                    }
                }
            }

            // Hoja de cálculo con columna fija y scroll horizontal
            Box(modifier = Modifier.fillMaxSize()) {
                LazyColumn(modifier = Modifier.fillMaxSize()) {
                    // Fila de encabezados de la tabla
                    item {
                        Row(
                            modifier = Modifier
                                .fillMaxWidth()
                                .background(MaterialTheme.colorScheme.primaryContainer)
                        ) {
                            // Columna Fija: N.º y Nombre
                            Box(
                                modifier = Modifier
                                    .width(180.dp)
                                    .height(52.dp)
                                    .border(0.5.dp, MaterialTheme.colorScheme.outlineVariant)
                                    .padding(8.dp),
                                contentAlignment = Alignment.CenterStart
                            ) {
                                Text(
                                    "Estudiante",
                                    fontWeight = FontWeight.Bold,
                                    color = MaterialTheme.colorScheme.onPrimaryContainer,
                                    fontSize = 13.sp
                                )
                            }

                            // Columnas desplazables: Categorías + Promedio
                            Row(modifier = Modifier.horizontalScroll(scrollHorizontalHeader)) {
                                uiState.categorias.forEach { cat ->
                                    Box(
                                        modifier = Modifier
                                            .width(96.dp)
                                            .height(52.dp)
                                            .border(0.5.dp, MaterialTheme.colorScheme.outlineVariant)
                                            .padding(4.dp),
                                        contentAlignment = Alignment.Center
                                    ) {
                                        Column(horizontalAlignment = Alignment.CenterHorizontally) {
                                            Text(
                                                cat.nombre,
                                                fontWeight = FontWeight.Bold,
                                                fontSize = 12.sp,
                                                color = MaterialTheme.colorScheme.onPrimaryContainer
                                            )
                                            Text(
                                                "(\${cat.pesoPorcentaje.toInt()}%)",
                                                fontSize = 10.sp,
                                                color = MaterialTheme.colorScheme.onPrimaryContainer.copy(alpha = 0.8f)
                                            )
                                        }
                                    }
                                }

                                // Columna fija de Promedio Final
                                Box(
                                    modifier = Modifier
                                        .width(90.dp)
                                        .height(52.dp)
                                        .background(MaterialTheme.colorScheme.secondaryContainer)
                                        .border(0.5.dp, MaterialTheme.colorScheme.outlineVariant)
                                        .padding(4.dp),
                                    contentAlignment = Alignment.Center
                                ) {
                                    Text(
                                        "Promedio",
                                        fontWeight = FontWeight.Bold,
                                        fontSize = 12.sp,
                                        color = MaterialTheme.colorScheme.onSecondaryContainer
                                    )
                                }
                            }
                        }
                    }

                    // Filas de estudiantes
                    itemsIndexed(uiState.filas, key = { _, f -> f.estudiante.id }) { index, fila ->
                        val cursoConfig = uiState.curso
                        val umbralAprobado = cursoConfig?.umbralAprobado ?: 7.0
                        val umbralRiesgo = cursoConfig?.umbralRiesgo ?: 5.0

                        val promedioColor = when {
                            fila.promedioFinal == null -> Color.Gray
                            fila.promedioFinal >= umbralAprobado -> Color(0xFF2E7D32) // Verde
                            fila.promedioFinal >= umbralRiesgo -> Color(0xFFF57F17)   // Amarillo/Naranja
                            else -> Color(0xFFC62828)                                  // Rojo
                        }

                        Row(
                            modifier = Modifier
                                .fillMaxWidth()
                                .background(
                                    if (index % 2 == 0) MaterialTheme.colorScheme.surface
                                    else MaterialTheme.colorScheme.surfaceVariant.copy(alpha = 0.35f)
                                )
                        ) {
                            // Columna Fija: Nombres de Estudiantes
                            Box(
                                modifier = Modifier
                                    .width(180.dp)
                                    .height(48.dp)
                                    .border(0.5.dp, MaterialTheme.colorScheme.outlineVariant)
                                    .padding(horizontal = 8.dp),
                                contentAlignment = Alignment.CenterStart
                            ) {
                                Column {
                                    Text(
                                        text = "\${index + 1}. \${fila.estudiante.apellidos}",
                                        fontWeight = FontWeight.SemiBold,
                                        fontSize = 12.sp,
                                        maxLines = 1
                                    )
                                    Text(
                                        text = fila.estudiante.nombres,
                                        fontSize = 11.sp,
                                        color = MaterialTheme.colorScheme.onSurfaceVariant,
                                        maxLines = 1
                                    )
                                }
                            }

                            // Casilleros desplazables: Calificaciones editables
                            Row(modifier = Modifier.horizontalScroll(scrollHorizontalBody)) {
                                uiState.categorias.forEach { cat ->
                                    val notaActual = fila.notasPorCategoria[cat.id]
                                    var textoNota by remember(notaActual) {
                                        mutableStateOf(notaActual?.toString() ?: "")
                                    }

                                    val celdaColor = when {
                                        notaActual == null -> Color.Transparent
                                        notaActual >= umbralAprobado -> Color(0xFFE8F5E9)
                                        notaActual >= umbralRiesgo -> Color(0xFFFFF8E1)
                                        else -> Color(0xFFFFEBEE)
                                    }

                                    Box(
                                        modifier = Modifier
                                            .width(96.dp)
                                            .height(48.dp)
                                            .background(celdaColor)
                                            .border(0.5.dp, MaterialTheme.colorScheme.outlineVariant),
                                        contentAlignment = Alignment.Center
                                    ) {
                                        OutlinedTextField(
                                            value = textoNota,
                                            onValueChange = { nuevoValor ->
                                                if (nuevoValor.isEmpty() || nuevoValor.toDoubleOrNull() != null) {
                                                    textoNota = nuevoValor
                                                    viewModel.actualizarNota(fila.estudiante.id, cat.id, nuevoValor)
                                                }
                                            },
                                            textStyle = LocalTextStyle.current.copy(
                                                textAlign = TextAlign.Center,
                                                fontSize = 13.sp,
                                                fontWeight = FontWeight.Medium
                                            ),
                                            keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Decimal),
                                            colors = OutlinedTextFieldDefaults.colors(
                                                focusedBorderColor = MaterialTheme.colorScheme.primary,
                                                unfocusedBorderColor = Color.Transparent
                                            ),
                                            modifier = Modifier.fillMaxSize()
                                        )
                                    }
                                }

                                // Casillero Calculado: Promedio Ponderado
                                Box(
                                    modifier = Modifier
                                        .width(90.dp)
                                        .height(48.dp)
                                        .border(0.5.dp, MaterialTheme.colorScheme.outlineVariant),
                                    contentAlignment = Alignment.Center
                                ) {
                                    Text(
                                        text = fila.promedioFinal?.toString() ?: "-",
                                        fontWeight = FontWeight.Bold,
                                        fontSize = 14.sp,
                                        color = promedioColor
                                    )
                                }
                            }
                        }
                    }
                }
            }
        }
    }
}
`,
  },
  {
    path: 'app/src/main/java/com/docente/registrocalificaciones/ui/screens/tareas/TareasScreen.kt',
    category: 'screen',
    name: 'TareasScreen.kt',
    description: 'Control de tareas y cálculo automático de días de atraso con penalización configurable y filtros.',
    content: `package com.docente.registrocalificaciones.ui.screens.tareas

import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.docente.registrocalificaciones.domain.calculation.GradeCalculator
import java.time.LocalDate

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun TareasScreen(
    cursoId: Long,
    onNavigateBack: () -> Unit
) {
    var mostrarFiltroAtrasadasOnly by remember { mutableStateOf(false) }

    Scaffold(
        topBar = {
            TopAppBar(
                title = { Text("Control de Tareas y Atrasos") },
                navigationIcon = {
                    IconButton(onClick = onNavigateBack) {
                        Icon(Icons.Default.ArrowBack, contentDescription = "Regresar")
                    }
                },
                actions = {
                    FilterChip(
                        selected = mostrarFiltroAtrasadasOnly,
                        onClick = { mostrarFiltroAtrasadasOnly = !mostrarFiltroAtrasadasOnly },
                        label = { Text("Solo atrasadas") },
                        leadingIcon = {
                            if (mostrarFiltroAtrasadasOnly) {
                                Icon(Icons.Default.Check, contentDescription = null, modifier = Modifier.size(16.dp))
                            }
                        }
                    )
                }
            )
        }
    ) { paddingValues ->
        Column(
            modifier = Modifier
                .fillMaxSize()
                .padding(paddingValues)
                .padding(16.dp)
        ) {
            Card(
                colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.tertiaryContainer),
                modifier = Modifier.fillMaxWidth().padding(bottom = 16.dp)
            ) {
                Column(modifier = Modifier.padding(14.dp)) {
                    Text(
                        "Reglas de Entrega y Penalización",
                        fontWeight = FontWeight.Bold,
                        color = MaterialTheme.colorScheme.onTertiaryContainer
                    )
                    Text(
                        "• Días de atraso calculados automáticamente contra la fecha límite.\\n" +
                        "• Penalización configurable (-0.5 pts por día hasta máx 3.0 pts).\\n" +
                        "• Alumnos con tareas sin entregar acumulan atraso en tiempo real.",
                        fontSize = 12.sp,
                        color = MaterialTheme.colorScheme.onTertiaryContainer.copy(alpha = 0.9f)
                    )
                }
            }

            Text("Tareas del Curso", style = MaterialTheme.typography.titleMedium, fontWeight = FontWeight.Bold)
            Spacer(Modifier.height(8.dp))

            // Lista representativa de tareas con cálculo en tiempo real
            val fechaLimiteDemo = LocalDate.now().minusDays(3).toString()
            val calculoEjemplo = GradeCalculator.calcularAtrasoYPenalizacion(
                fechaLimiteStr = fechaLimiteDemo,
                fechaEntregaRealStr = null,
                entregada = false,
                notaOriginal = null
            )

            Card(
                modifier = Modifier.fillMaxWidth(),
                colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surfaceVariant)
            ) {
                Column(modifier = Modifier.padding(16.dp)) {
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.SpaceBetween
                    ) {
                        Text("Tarea 1: Ecuaciones Cuadráticas", fontWeight = FontWeight.Bold)
                        Badge(containerColor = Color(0xFFC62828)) {
                            Text("Atrasada", color = Color.white)
                        }
                    }
                    Text("Fecha Límite: $fechaLimiteDemo", fontSize = 12.sp, color = MaterialTheme.colorScheme.onSurfaceVariant)
                    Spacer(Modifier.height(8.dp))
                    Text(
                        "Estado de entrega del estudiante: \${calculoEjemplo.descripcionEstado}",
                        fontSize = 13.sp,
                        fontWeight = FontWeight.Medium
                    )
                    Text(
                        "Penalización acumulada: -\${calculoEjemplo.penalizacion} pts",
                        fontSize = 12.sp,
                        color = Color(0xFFC62828),
                        fontWeight = FontWeight.SemiBold
                    )
                }
            }
        }
    }
}
`,
  },
  {
    path: 'app/src/main/java/com/docente/registrocalificaciones/MainActivity.kt',
    category: 'screen',
    name: 'MainActivity.kt',
    description: 'Activity principal con Compose Material 3, tema y navegación completa entre Cursos, Planilla y Tareas.',
    content: `package com.docente.registrocalificaciones

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.enableEdgeToEdge
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Surface
import androidx.compose.ui.Modifier
import androidx.navigation.compose.NavHost
import androidx.navigation.compose.composable
import androidx.navigation.compose.rememberNavController
import com.docente.registrocalificaciones.ui.screens.cursos.CursosScreen
import com.docente.registrocalificaciones.ui.screens.planilla.PlanillaScreen
import com.docente.registrocalificaciones.ui.screens.tareas.TareasScreen
import dagger.hilt.android.AndroidEntryPoint

@AndroidEntryPoint
class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        enableEdgeToEdge()
        setContent {
            MaterialTheme {
                Surface(
                    modifier = Modifier.fillMaxSize(),
                    color = MaterialTheme.colorScheme.background
                ) {
                    val navController = rememberNavController()

                    NavHost(navController = navController, startDestination = "cursos") {
                        composable("cursos") {
                            CursosScreen(
                                onNavigateToPlanilla = { cursoId ->
                                    navController.navigate("planilla/$cursoId")
                                }
                            )
                        }
                        composable("planilla/{cursoId}") { backStackEntry ->
                            val cursoId = backStackEntry.arguments?.getString("cursoId")?.toLongOrNull() ?: 0L
                            PlanillaScreen(
                                onNavigateBack = { navController.popBackStack() },
                                onNavigateToTareas = { navController.navigate("tareas/$cursoId") },
                                onNavigateToReportes = { /* Navegación a reportes */ }
                            )
                        }
                        composable("tareas/{cursoId}") { backStackEntry ->
                            val cursoId = backStackEntry.arguments?.getString("cursoId")?.toLongOrNull() ?: 0L
                            TareasScreen(
                                cursoId = cursoId,
                                onNavigateBack = { navController.popBackStack() }
                            )
                        }
                    }
                }
            }
        }
    }
}
`,
  },
  {
    path: 'app/src/main/java/com/docente/registrocalificaciones/ui/screens/cursos/CursosScreen.kt',
    category: 'screen',
    name: 'CursosScreen.kt',
    description: 'Gestión de Cursos y Paralelos con Jetpack Compose Material 3 (crear, editar, eliminar, abrir planilla).',
    content: `package com.docente.registrocalificaciones.ui.screens.cursos

import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.docente.registrocalificaciones.data.local.entity.CursoEntity

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun CursosScreen(
    onNavigateToPlanilla: (Long) -> Unit
) {
    var mostrarDialogoNuevoCurso by remember { mutableStateOf(false) }

    // Lista demostrativa
    val cursosMock = remember {
        mutableStateListOf(
            CursoEntity(
                id = 1,
                nombre = "8vo EGB - Paralelo A",
                materia = "Matemáticas",
                anioLectivo = "2025-2026",
                periodo = "Primer Quimestre"
            ),
            CursoEntity(
                id = 2,
                nombre = "9no EGB - Paralelo B",
                materia = "Física y Química",
                anioLectivo = "2025-2026",
                periodo = "1er Trimestre"
            ),
            CursoEntity(
                id = 3,
                nombre = "10mo EGB - Paralelo A",
                materia = "Geometría",
                anioLectivo = "2025-2026",
                periodo = "Primer Quimestre"
            )
        )
    }

    Scaffold(
        topBar = {
            TopAppBar(
                title = { Text("Registro de Calificaciones", fontWeight = FontWeight.Bold) },
                colors = TopAppBarDefaults.topAppBarColors(
                    containerColor = MaterialTheme.colorScheme.primaryContainer,
                    titleContentColor = MaterialTheme.colorScheme.onPrimaryContainer
                )
            )
        },
        floatingActionButton = {
            ExtendedFloatingActionButton(
                onClick = { mostrarDialogoNuevoCurso = true },
                icon = { Icon(Icons.Default.Add, contentDescription = null) },
                text = { Text("Nuevo Curso") }
            )
        }
    ) { paddingValues ->
        LazyColumn(
            modifier = Modifier
                .fillMaxSize()
                .padding(paddingValues)
                .padding(16.dp),
            verticalArrangement = Arrangement.spacedBy(12.dp)
        ) {
            items(cursosMock, key = { it.id }) { curso ->
                Card(
                    modifier = Modifier
                        .fillMaxWidth()
                        .clickable { onNavigateToPlanilla(curso.id) },
                    elevation = CardDefaults.cardElevation(defaultElevation = 2.dp)
                ) {
                    Column(modifier = Modifier.padding(16.dp)) {
                        Row(
                            modifier = Modifier.fillMaxWidth(),
                            horizontalArrangement = Arrangement.SpaceBetween,
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            Text(curso.nombre, style = MaterialTheme.typography.titleMedium, fontWeight = FontWeight.Bold)
                            SuggestionChip(
                                onClick = {},
                                label = { Text(curso.periodo, fontSize = 11.sp) }
                            )
                        }
                        Spacer(Modifier.height(4.dp))
                        Text("Materia: \${curso.materia}", color = MaterialTheme.colorScheme.onSurfaceVariant)
                        Text("Año Lectivo: \${curso.anioLectivo}", fontSize = 12.sp, color = MaterialTheme.colorScheme.outline)

                        Spacer(Modifier.height(12.dp))
                        Row(
                            modifier = Modifier.fillMaxWidth(),
                            horizontalArrangement = Arrangement.End
                        ) {
                            Button(
                                onClick = { onNavigateToPlanilla(curso.id) },
                                colors = ButtonDefaults.buttonColors(containerColor = MaterialTheme.colorScheme.primary)
                            ) {
                                Icon(Icons.Default.TableChart, contentDescription = null, modifier = Modifier.size(18.dp))
                                Spacer(Modifier.width(8.dp))
                                Text("Abrir Planilla")
                            }
                        }
                    }
                }
            }
        }
    }
}
`,
  },
];
