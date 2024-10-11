import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from './user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  // Criar novo usuário considerando usuários inativos
  async create(createUserDto: CreateUserDto): Promise<User> {
    const { password, ...userData } = createUserDto;

    const emailExists = await this.usersRepository.findOne({
      where: { email: userData.email, is_active: true }, // Verificar usuários ativos
    });

    if (emailExists) {
      throw new ConflictException(
        'Unable to create user. Email already registered with an active account.',
      );
    }

    const identificationDocumentsExists = await this.usersRepository.findOne({
      where: [
        { cpf: userData.cpf, is_active: true }, // Verificar CPF ativo
        { rg: userData.rg, is_active: true },   // Verificar RG ativo
      ],
    });

    if (identificationDocumentsExists) {
      throw new ConflictException(
        'Unable to create user. Identification documents already registered with an active account.',
      );
    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const user = this.usersRepository.create({
      ...userData,
      password: hashedPassword,
      is_active: true, // Novo usuário é criado como ativo
    });

    return this.usersRepository.save(user);
  }

  async getUser(id: string): Promise<Omit<User, 'password'>> {
    const user = await this.findById(id);

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  async isAdmin(id: string): Promise<boolean> {
    const user = await this.usersRepository.findOne({ where: { id } });
    return !!user.is_admin;
  }

  async findById(id: string): Promise<User | undefined> {
    return await this.usersRepository.findOne({ where: { id } });
  }

  async findByEmail(email: string): Promise<User | undefined> {
    return this.usersRepository.findOne({ where: { email } });
  }

  async findByIdentificationDocuments(
    cpf: string,
    rg: string,
  ): Promise<User | undefined> {
    return this.usersRepository.findOne({
      where: [
        { rg, is_active: true }, // Considerar apenas usuários ativos
        { cpf, is_active: true }, // Considerar apenas usuários ativos
      ],
    });
  }

  async update(
    id: string,
    updateUserDto: UpdateUserDto,
  ): Promise<Omit<User, 'password'>> {
    const emailExists = await this.usersRepository.findOne({
      where: { email: updateUserDto.email, is_active: true }, // Verificar usuários ativos
    });

    if (emailExists && emailExists.id !== id) {
      throw new ConflictException(
        'Unable to update user. Email already registered with an active account.',
      );
    }

    const identificationDocumentsExists = await this.usersRepository.findOne({
      where: [
        { cpf: updateUserDto.cpf, is_active: true },
        { rg: updateUserDto.rg, is_active: true },
      ],
    });

    if (identificationDocumentsExists && identificationDocumentsExists.id !== id) {
      throw new ConflictException(
        'Unable to update user. Identification documents already registered with an active account.',
      );
    }

    await this.usersRepository.update(id, updateUserDto);
    const updatedUser = await this.usersRepository.findOne({ where: { id } });

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...userWithoutPassword } = updatedUser;
    return userWithoutPassword;
  }

  async deactivateUser(id: string, password: string): Promise<void> {
    const user = await this.findById(id);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Verificar se a senha fornecida está correta
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new ConflictException('Invalid password');
    }

    // Criptografar CPF e RG
    const encryptedCpf = await bcrypt.hash(user.cpf, 10);
    const encryptedRg = await bcrypt.hash(user.rg, 10);

    // Anonimizar o nome e o email do usuário
    const anonymizedEmail = `${user.id}@mail.com`; // Usar o ID do usuário no e-mail
    const anonymizedName = 'Usuário inativo';      // Alterar o nome para "Usuário inativo"

    // Marcar o usuário como inativo e atualizar CPF, RG, nome e e-mail
    await this.usersRepository.update(id, {
      is_active: false,
      cpf: encryptedCpf,
      rg: encryptedRg,
      email: anonymizedEmail,
      name: anonymizedName,
    });
  }
}
