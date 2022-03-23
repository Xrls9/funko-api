import { Test, TestingModule } from '@nestjs/testing';
import { User } from '@prisma/client';
import { plainToInstance } from 'class-transformer';
import { internet, datatype, commerce } from 'faker';
import { NotFound } from 'http-errors';
import { clearDatabase, prisma } from '../../prisma';
import { UserFactory } from '../../user/factories/user.factory';
import { FunkoController } from '../controllers/funko.controller';
import { CreateFunkoDto } from '../dtos/req/create-funko.dto';
import { UpdateFunkoDto } from '../dtos/req/update-funko.dto';
import { FunkoDto } from '../dtos/res/funko.dto';
import { FunkoFactory } from '../factories/funko.factory';
import { FunkoService } from './funko.service';

describe('FunkoService', () => {
  //TODO remove imports and unused vars with eslint
  let randomvar: FunkoService;
  let funkoService: FunkoService;
  let userFactory: UserFactory;
  let funkoFactory: FunkoFactory;
  let newUser: User;
  let dto: CreateFunkoDto;

  beforeAll(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [FunkoController],
      providers: [FunkoService],
    }).compile();

    funkoService = app.get<FunkoService>(FunkoService);
    userFactory = new UserFactory(prisma);
    funkoFactory = new FunkoFactory(prisma);

    newUser = await userFactory.make({
      username: internet.userName(),
      password: internet.password(),
    });

    dto = plainToInstance(CreateFunkoDto, {
      name: 'Iron Man',
      category: 'default',
      stock: 10,
      price: 50.0,
    });
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterAll(async () => {
    await clearDatabase();
    await prisma.$disconnect();
  });

  describe('create', () => {
    it('should create a new funko', async () => {
      const result = await funkoService.create(newUser.uuid, dto);
      expect(result).toHaveProperty('active', true);
    });
  });

  describe('update', () => {
    let funko: FunkoDto;
    beforeAll(async () => {
      funko = await funkoService.create(newUser.uuid, dto);
    });

    it('should throw an error if the funko does not exist', async () => {
      const data = plainToInstance(UpdateFunkoDto, {});
      await expect(
        funkoService.update(datatype.uuid(), data),
      ).rejects.toThrowError(new NotFound('Funko not found'));
    });

    it('should update the funko values', async () => {
      const name = commerce.productName();
      const data = plainToInstance(UpdateFunkoDto, { name: name });

      const result = await funkoService.update(funko.uuid, data);

      expect(result).toHaveProperty('name', name);
    });

    it('should disable product', async () => {
      const data = plainToInstance(UpdateFunkoDto, { active: false });
      const result = await funkoService.update(funko.uuid, data);
      expect(result).toHaveProperty('active', false);
    });
  });

  describe('remove', () => {
    it('should throw an error if the funko does not exist', async () => {
      await expect(funkoService.remove(datatype.uuid())).rejects.toThrowError(
        new NotFound('Funko not found'),
      );
    });

    it('should remove the funko', async () => {
      const funko = await funkoService.create(newUser.uuid, dto);

      const result = await funkoService.remove(funko.uuid);

      expect(result).toHaveProperty('uuid', `${funko.uuid}`);
    });
  });

  describe('find', () => {
    it('should return a list of funkos', async () => {
      const funkos = await funkoFactory.makeMany(2, {
        user: { connect: { uuid: (await userFactory.make()).uuid } },
      });

      const result = await funkoService.find(0, funkos.length, 'default');

      expect(result.length).toBe(funkos.length);
    });
  });

  describe('findOne', () => {
    let funko: FunkoDto;

    beforeAll(async () => {
      funko = await funkoService.create(newUser.uuid, dto);
    });

    it('should throw an error if the funko does not exist', async () => {
      await expect(funkoService.findOne(datatype.uuid())).rejects.toThrowError(
        new NotFound('No Funko found'),
      );
    });

    it('should return the funko', async () => {
      const result = await funkoService.findOne(funko.uuid);

      expect(result).toHaveProperty('uuid', funko.uuid);
    });
  });

  // describe('Reactions: ', () => {
  //   beforeAll(async () => {
  //     post = await prisma.post.create({
  //       data: {
  //         ...dto,
  //         userId: newUser.uuid,
  //       },
  //     });

  //     reaction = plainToInstance(CreatePostReactionDto, {
  //       postId: post.uuid,
  //       status: 'L',
  //     });
  //   });

  //   describe('createReaction', () => {
  //     it('should create a reaction for the post', async () => {
  //       const result = await PostsService.createReaction(
  //         newUser.uuid,
  //         reaction,
  //       );
  //       expect(result).toHaveProperty('status', 'L');
  //     });
  //   });

  //   describe('updateReaction', () => {
  //     it('should update the reaction for the post', async () => {
  //       const newReaction = await PostsService.createReaction(
  //         newUser.uuid,
  //         reaction,
  //       );

  //       const result = await PostsService.updateReaction(newReaction.uuid, 'D');

  //       expect(result).toHaveProperty('status', 'D');
  //     });

  //     it('should throw an error if the post does not exist', async () => {
  //       expect(async () => {
  //         const result = await PostsService.updateReaction(
  //           datatype.uuid(),
  //           'D',
  //         );
  //       }).rejects.toThrowError(new NotFound('Post Reaction not found'));
  //     });
  //   });

  //   describe('findPostReaction', () => {
  //     it('should return the reaction to a post', async () => {
  //       const newReaction = await PostsService.createReaction(
  //         newUser.uuid,
  //         reaction,
  //       );

  //       const result = await PostsService.findPostReaction(
  //         newReaction.postId,
  //         newUser.uuid,
  //       );

  //       expect(result[0]).toHaveProperty('status', 'L');
  //       expect(result[0]).toHaveProperty('userId', newReaction.userId);
  //     });

  //     it('should return an empty array if there is no reaction to the post', async () => {
  //       const result = await PostsService.findPostReaction(
  //         datatype.uuid(),
  //         newUser.uuid,
  //       );

  //       expect(result).toBeEmpty();
  //     });
  //   });
  // });
});
