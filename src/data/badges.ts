export type Badge = {
  label: string;
  href: string;
  image: string;
};

export type BadgeSection = {
  title: string;
  emoji: string;
  badges: Badge[];
};

const badge = (label: string, color: string, logo: string, href = 'https://ehgp.github.io'): Badge => ({
  label,
  href,
  image: `https://img.shields.io/badge/${encodeURIComponent(label)}-${color}?style=for-the-badge&logo=${logo}&logoColor=white`
});

export const badgeSections: BadgeSection[] = [
  {
    title: 'Languages',
    emoji: '🧑\u200d💻',
    badges: [
      badge('JavaScript', '323330', 'javascript'),
      badge('TypeScript', '007ACC', 'typescript'),
      badge('Python', 'FFD43B', 'python'),
      badge('Java', 'ED8B00', 'java'),
      badge('C++', '00599C', 'c%2B%2B'),
      badge('HTML5', 'E34F26', 'html5'),
      badge('CSS3', '1572B6', 'css3'),
      badge('PLSQL', 'F80000', 'oracle'),
      badge('Solidity', '000000', 'solidity'),
      badge('Scala', 'DC322F', 'scala')
    ]
  },
  {
    title: 'Frameworks & Libraries',
    emoji: '🧩',
    badges: [
      badge('React', '20232A', 'react'),
      badge('Node.js', '339933', 'nodedotjs'),
      badge('Express', '000000', 'express'),
      badge('Next.js', '000000', 'next.js'),
      badge('Flask', '000000', 'flask'),
      badge('jQuery', '0769AD', 'jquery'),
      badge('Sass', 'CC6699', 'sass'),
      badge('Material UI', '007FFF', 'mui'),
      badge('Bootstrap', '563D7C', 'bootstrap'),
      badge('Trino', 'dd00a1', 'trino'),
      badge('Spark', 'F55B14', 'apache'),
      badge('Kafka', '000000', 'apache'),
      badge('Storm', '000000', 'apache'),
      badge('Selenium', '000000', 'selenium'),
      badge('TensorFlow', 'ff6f00', 'tensorflow')
    ]
  },
  {
    title: 'Databases & Warehousing',
    emoji: '🗃️',
    badges: [
      badge('PostgreSQL', '316192', 'postgresql'),
      badge('SQL Server', 'CC2927', 'microsoftsqlserver'),
      badge('MongoDB', '4EA94B', 'mongodb'),
      badge('MySQL', '005C84', 'mysql'),
      badge('SQLite', '07405E', 'sqlite'),
      badge('Hadoop', '000000', 'apache'),
      badge('Snowflake', '0693e3', 'snowflake'),
      badge('Cassandra', '1c81a0', 'apachecassandra')
    ]
  },
  {
    title: 'Tools',
    emoji: '⚒️',
    badges: [
      badge('Git', 'E44C30', 'git'),
      badge('GitHub', '100000', 'github'),
      badge('GitLab', 'FC6D26', 'gitlab'),
      badge('Firebase', 'ffca28', 'firebase'),
      badge('Postman', 'FF6C37', 'postman'),
      badge('Twilio', 'F22F46', 'twilio'),
      badge('npm', 'CB3837', 'npm'),
      badge('PyPI', '3775A9', 'pypi'),
      badge('Conda', '342B029', 'anaconda'),
      badge('Databricks', 'FF3621', 'databricks'),
      badge('Tableau', 'ffffff', 'tableau'),
      badge('Alteryx', '007bbd', 'alteryx')
    ]
  },
  {
    title: 'Cloud & IaaS',
    emoji: '☁',
    badges: [
      badge('AWS', 'ec7211', 'amazon'),
      badge('GCP', '2962ff', 'google'),
      badge('Azure', '2962ff', 'microsoftazure'),
      badge('Netlify', '00C7B7', 'netlify'),
      badge('Heroku', '430098', 'heroku'),
      badge('Docker', '2CA5E0', 'docker'),
      badge('ngrok', '007aff', 'ngrok'),
      badge('Terraform', '7B42BC', 'terraform'),
      badge('Render', '0fe0b6', 'render'),
      badge('Vercel', '000000', 'vercel')
    ]
  },
  {
    title: 'IDEs & Workspaces',
    emoji: '🧠',
    badges: [
      badge('VS Code', '0078D4', 'visual%20studio%20code'),
      badge('PyCharm', '000000', 'pycharm'),
      badge('IntelliJ', '000000', 'intellij-idea'),
      badge('Notepad++', '90E59A', 'notepad%2B%2B'),
      badge('Windows', '0078D6', 'windows'),
      badge('Linux', '0168D6', 'linux'),
      badge('Mac', '0168D6', 'apple')
    ]
  }
];
