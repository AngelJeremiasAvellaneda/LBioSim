import { ModuleId } from "@/generated/prisma/enums";

const MODULE_ID_MAP: Record<string, string> = {
  "que-es-el-adn": ModuleId.DNA_STRUCTURE,
  "construye-tu-adn": ModuleId.GENETIC_CODE,
  replicacion: ModuleId.DNA_REPLICATION,
  transcripcion: ModuleId.TRANSCRIPTION,
  traduccion: ModuleId.TRANSLATION,
  aminoacidos: ModuleId.AMINO_ACIDS,
  proteinas: ModuleId.PROTEINS,
  mutaciones: ModuleId.MUTATIONS,
  enfermedades: ModuleId.GENE_REGULATION,
  laboratorio: ModuleId.VIRTUAL_LAB,
  comparador: ModuleId.GENOMICS,
  quiz: ModuleId.BIOINFORMATICS,
  "modelos-3d": ModuleId.CELL_CYCLE,
  "dogma-temporal": ModuleId.EPIGENETICS,
  evaluacion: ModuleId.EVOLUTION,
};

export function toPrismaModuleId(slug: string): string {
  const mapped = MODULE_ID_MAP[slug];
  if (!mapped) {
    throw new Error(`Módulo desconocido: ${slug}`);
  }
  return mapped;
}
