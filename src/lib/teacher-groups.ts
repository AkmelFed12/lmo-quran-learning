export type TeacherClass = {
  id: string;
  name: string;
  teacherId: string;
  teacherEmail: string;
  studentIds: string[];
  objective: string;
  level: "Débutant" | "Intermédiaire" | "Avancé" | "Mixte";
  createdAt?: unknown;
  updatedAt?: unknown;
};

export type LearnerSnapshot = {
  id: string;
  displayName?: string;
  email?: string;
  role?: string;
  arabicProgress: number;
  memorizationProgress: number;
  listeningProgress: number;
  lastAssessment?: {
    module?: string;
    score?: number;
    total?: number;
  };
};

export function getLearnerRecommendation(learner: LearnerSnapshot) {
  if (learner.arabicProgress < 35) return "Renforcer alphabet et voyelles avant d'ajouter de longues lectures.";
  if (learner.listeningProgress < 30) return "Prévoir une courte écoute accompagnée chaque jour.";
  if (learner.memorizationProgress < 10) return "Commencer par une petite portion stable et des révisions espacées.";
  const assessmentRatio = learner.lastAssessment?.total
    ? (learner.lastAssessment.score || 0) / learner.lastAssessment.total
    : 1;
  if (assessmentRatio < 0.65) return "Reprendre les erreurs du dernier test avant le module suivant.";
  return "Progression équilibrée. Continuer avec une session courte et régulière.";
}
