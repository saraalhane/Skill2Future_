<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use App\Models\Course;
use App\Models\Module;
use App\Models\Lesson;
use App\Models\UserCourse;
use App\Models\User;

class CourseSeeder extends Seeder
{
    public function run(): void
    {
        // Disable FK checks so truncate works even with existing constraints
        DB::statement('SET FOREIGN_KEY_CHECKS=0');
        Lesson::truncate();
        Module::truncate();
        Course::truncate();
        UserCourse::truncate();
        DB::statement('SET FOREIGN_KEY_CHECKS=1');

        $courses = [
            [
                'title'           => 'Développement Web Complet',
                'category'        => 'Développement Web',
                'level'           => 'Débutant',
                'duration'        => '25h 30m',
                'description'     => 'Apprenez le développement web de A à Z avec HTML, CSS, JS et React.',
                'tags'            => 'HTML, CSS, JavaScript, React',
                'lessons_count'   => 12,
                'exercises_count' => 3,
                'icon'            => 'fas fa-code',
                'color_bg'        => '#6366f1',
                'modules' => [
                    [
                        'title' => 'Introduction',
                        'order' => 1,
                        'lessons' => [
                            ['title' => "Bienvenue dans le cours",          'duration' => '5 min',  'type' => 'video',    'video_url' => 'https://www.youtube.com/embed/qz0aGYrrlhU', 'order' => 1],
                            ['title' => "Configuration de l'environnement", 'duration' => '12 min', 'type' => 'video',    'video_url' => 'https://www.youtube.com/embed/1Rs2ND1ryYc', 'order' => 2],
                            ['title' => "Votre premier projet",              'duration' => '18 min', 'type' => 'video',    'video_url' => 'https://www.youtube.com/embed/W6NZfCO5SIk', 'order' => 3],
                        ],
                    ],
                    [
                        'title' => 'HTML & CSS Fondamentaux',
                        'order' => 2,
                        'lessons' => [
                            ['title' => 'Structure HTML5',    'duration' => '20 min', 'type' => 'video',    'video_url' => 'https://www.youtube.com/embed/qz0aGYrrlhU', 'order' => 1],
                            ['title' => 'Flexbox & Grid',     'duration' => '25 min', 'type' => 'article',  'order' => 2],
                            ['title' => 'Exercice pratique',  'duration' => '30 min', 'type' => 'exercise', 'order' => 3],
                        ],
                    ],
                    [
                        'title' => 'JavaScript Avancé',
                        'order' => 3,
                        'lessons' => [
                            ['title' => 'ES6+ et les Promises',    'duration' => '22 min', 'type' => 'video',    'video_url' => 'https://www.youtube.com/embed/W6NZfCO5SIk', 'order' => 1],
                            ['title' => 'Fetch API & Async/Await', 'duration' => '28 min', 'type' => 'video',    'video_url' => 'https://www.youtube.com/embed/W6NZfCO5SIk', 'order' => 2],
                            ['title' => 'Mini-projet: Todo App',   'duration' => '45 min', 'type' => 'exercise', 'order' => 3],
                        ],
                    ],
                    [
                        'title' => 'React & Ecosystème',
                        'order' => 4,
                        'lessons' => [
                            ['title' => 'Composants & Props', 'duration' => '20 min', 'type' => 'video',    'video_url' => 'https://www.youtube.com/embed/bMknfKXIFA8', 'order' => 1],
                            ['title' => 'State & Hooks',      'duration' => '35 min', 'type' => 'video',    'video_url' => 'https://www.youtube.com/embed/bMknfKXIFA8', 'order' => 2],
                            ['title' => 'Projet Final',       'duration' => '60 min', 'type' => 'exercise', 'order' => 3],
                        ],
                    ],
                ],
            ],
            [
                'title'           => 'Python pour la Data Science',
                'category'        => 'Data Science',
                'level'           => 'Intermédiaire',
                'duration'        => '18h 45m',
                'description'     => 'Maîtrisez Python, Pandas et la visualisation de données pour devenir un expert.',
                'tags'            => 'Python, Pandas, Data',
                'lessons_count'   => 9,
                'exercises_count' => 2,
                'icon'            => 'fas fa-chart-line',
                'color_bg'        => '#10b981',
                'modules' => [
                    [
                        'title' => 'Bases de Python',
                        'order' => 1,
                        'lessons' => [
                            ['title' => 'Introduction à Python',        'duration' => '15 min', 'type' => 'video',    'video_url' => 'https://www.youtube.com/embed/_uQrJ0TkZlc', 'order' => 1],
                            ['title' => 'Variables et Types de données','duration' => '20 min', 'type' => 'article',  'order' => 2],
                            ['title' => 'Exercice: Calculatrice',       'duration' => '25 min', 'type' => 'exercise', 'order' => 3],
                        ],
                    ],
                    [
                        'title' => 'Pandas & NumPy',
                        'order' => 2,
                        'lessons' => [
                            ['title' => 'Introduction à NumPy',        'duration' => '22 min', 'type' => 'video',   'video_url' => 'https://www.youtube.com/embed/QUT1VHiLmmI', 'order' => 1],
                            ['title' => 'DataFrames avec Pandas',      'duration' => '30 min', 'type' => 'video',   'video_url' => 'https://www.youtube.com/embed/vmEHCJofslg', 'order' => 2],
                            ['title' => 'Nettoyage de données',        'duration' => '35 min', 'type' => 'article', 'order' => 3],
                        ],
                    ],
                    [
                        'title' => 'Visualisation',
                        'order' => 3,
                        'lessons' => [
                            ['title' => 'Matplotlib et Seaborn',    'duration' => '28 min', 'type' => 'video',    'video_url' => 'https://www.youtube.com/embed/UO98lJQ3QGI', 'order' => 1],
                            ['title' => 'Graphiques interactifs',   'duration' => '20 min', 'type' => 'article',  'order' => 2],
                            ['title' => 'Projet: Analyse de données','duration' => '50 min', 'type' => 'exercise', 'order' => 3],
                        ],
                    ],
                ],
            ],
            [
                'title'           => 'Cybersécurité Fondamentaux',
                'category'        => 'Cybersécurité',
                'level'           => 'Débutant',
                'duration'        => '15h 20m',
                'description'     => 'Comprenez les bases de la sécurité informatique, les vulnérabilités et la protection des réseaux.',
                'tags'            => 'Sécurité, Réseau, Hacking',
                'lessons_count'   => 8,
                'exercises_count' => 2,
                'icon'            => 'fas fa-shield-alt',
                'color_bg'        => '#f59e0b',
                'modules' => [
                    [
                        'title' => 'Introduction à la Sécurité',
                        'order' => 1,
                        'lessons' => [
                            ['title' => 'Les bases de la cybersécurité', 'duration' => '18 min', 'type' => 'video',   'video_url' => 'https://www.youtube.com/embed/inWWhr5tnEA', 'order' => 1],
                            ['title' => 'Types de cyberattaques',        'duration' => '22 min', 'type' => 'article', 'order' => 2],
                            ['title' => 'Chiffrement et cryptographie',  'duration' => '25 min', 'type' => 'video',   'video_url' => 'https://www.youtube.com/embed/jhXCTbFnK8o', 'order' => 3],
                        ],
                    ],
                    [
                        'title' => 'Sécurité Réseau',
                        'order' => 2,
                        'lessons' => [
                            ['title' => 'Firewalls et VPN',       'duration' => '20 min', 'type' => 'video',    'video_url' => 'https://www.youtube.com/embed/KDZEX2-n030', 'order' => 1],
                            ['title' => 'Protocoles sécurisés',   'duration' => '15 min', 'type' => 'article',  'order' => 2],
                        ],
                    ],
                    [
                        'title' => 'Pratique & Certification',
                        'order' => 3,
                        'lessons' => [
                            ['title' => 'Audit de sécurité',     'duration' => '30 min', 'type' => 'exercise', 'order' => 1],
                            ['title' => 'Rapport de vulnérabilité','duration' => '40 min','type' => 'exercise', 'order' => 2],
                            ['title' => 'Préparation certification','duration' => '20 min','type' => 'article', 'order' => 3],
                        ],
                    ],
                ],
            ],
        ];

        foreach ($courses as $courseData) {
            $modulesData = $courseData['modules'];
            unset($courseData['modules']);

            // Update lessons_count from actual data
            $courseData['lessons_count'] = array_sum(
                array_map(fn($m) => count($m['lessons']), $modulesData)
            );
            $courseData['exercises_count'] = array_sum(
                array_map(fn($m) => count(array_filter($m['lessons'], fn($l) => $l['type'] === 'exercise')), $modulesData)
            );

            $course = Course::create($courseData);

            foreach ($modulesData as $moduleData) {
                $lessonsData = $moduleData['lessons'];
                unset($moduleData['lessons']);

                $module = Module::create([
                    'course_id' => $course->id,
                    'title'     => $moduleData['title'],
                    'order'     => $moduleData['order'],
                ]);

                foreach ($lessonsData as $lessonData) {
                    Lesson::create([
                        'module_id' => $module->id,
                        'course_id' => $course->id,
                        'title'     => $lessonData['title'],
                        'duration'  => $lessonData['duration'],
                        'type'      => $lessonData['type'],
                        'video_url' => $lessonData['video_url'] ?? null,
                        'order'     => $lessonData['order'],
                    ]);
                }
            }

            // Enrol the first user in all courses with some progress
            $user = User::first();
            if ($user) {
                UserCourse::create([
                    'user_id'   => $user->id,
                    'course_id' => $course->id,
                    'status'    => 'en_cours',
                    'progress'  => rand(10, 70),
                ]);
            }
        }
    }
}
